import { Request, Response } from "express";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
  validationError,
} from "../helpers/api_response";
import IpoSchema from "../models/ipo";
import BankAccount from "../models/bankAccount";
import utils from "../helpers/utils";

const createIpoListing = async (req: Request, res: Response) => {
  try {
    const userId = utils.getUserId(req);

    const {
      listingName,
      price,
      numberOfShares,
      expectedGMP,
      listingDate,
      isApplied,
      fundsReleaseDate,
      bankAccountId,
    } = req.body;

    const primaryBankAccount = await BankAccount.findOne({
      userId,
      isPrimary: true,
    });
    const operationalBankAccountId = bankAccountId
      ? bankAccountId
      : primaryBankAccount?._id;
    console.log("operationalBankAccountId", operationalBankAccountId);

    if (
      !listingName ||
      !price ||
      !numberOfShares ||
      !expectedGMP ||
      !listingDate ||
      !userId ||
      !fundsReleaseDate ||
      !operationalBankAccountId
    ) {
      return validationError(res, "Missing required fields");
    }

    if (price <= 0) {
      return validationError(res, "Price should be greater than zero");
    }

    const createIpoListing = new IpoSchema({
      listingName,
      price,
      numberOfShares,
      expectedGMP,
      listingDate,
      userId,
      bankAccountId: operationalBankAccountId,
      isApplied,
      fundsReleaseDate,
    });
    console.log("createIpoListing", createIpoListing);

    await createIpoListing.save();
    const blockInBankAccount = await BankAccount.findByIdAndUpdate(
      operationalBankAccountId,
      {
        $inc: { balance: -price, blockedBalance: price },
      },
      { new: true },
    );

    console.log("result", blockInBankAccount);
    const result = { createIpoListing, blockInBankAccount };

    return successResponse(res, "Application done successfully", result);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

const actionOnIpo = async (req: Request, res: Response) => {
  try {
    const userId = utils.getUserId(req);
    const { ipoId, isAlloted } = req.body;
    if (!ipoId || isAlloted === undefined || !userId) {
      return validationError(res, "Missing required Fields");
    }
    const ipo = await IpoSchema.findOne({ _id: ipoId, userId });
    if (!ipo) {
      return notFoundResponse(res, "IPO not found");
    }
    if (isAlloted === true) {
      const setAllotmentStatus = await IpoSchema.findByIdAndUpdate(
        { _id: ipo._id },
        { isAlloted: true },
        { new: true },
      );
      const deductFromBankAccount = await BankAccount.findOneAndUpdate(
        { _id: ipo.bankAccountId, userId },
        {
          $inc: { blockedBalance: -ipo.price },
        },
        { new: true },
      );
      const result = {
        setAllotmentStatus,
        deductFromBankAccount,
      };
      return successResponse(
        res,
        "Congratulations on the Allotment!!!",
        result,
      );
    }
    if (isAlloted !== true) {
      const setAllotmentStatus = await IpoSchema.findByIdAndUpdate(
        { _id: ipo._id },
        { isAlloted: false },
        { new: true },
      );
      const releaseBlockedAmount = await BankAccount.findOneAndUpdate(
        { _id: ipo.bankAccountId, userId },
        {
          $inc: { blockedBalance: -ipo.price, balance: ipo.price },
        },
        { new: true },
      );
      23;
      const result = {
        setAllotmentStatus,
        releaseBlockedAmount,
      };
      return successResponse(res, "Better luck next time!!!", result);
    }
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export default {
  createIpoListing,
  actionOnIpo,
};
