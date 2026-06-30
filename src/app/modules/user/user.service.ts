import bcrypt from "bcryptjs";
import { RegisterUserPayload } from "./user.interface";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "../../../../generated/prisma/client";
import { ProfileUpdateInput } from "../../../../generated/prisma/models";
import AppError from "../../utils/AppError";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, role, bio, profilePhoto } = payload;
  console.log(name, email, password);

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.BCRYPT_SALT_ROUND),
  );

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (isUserExist) {
    throw new AppError(StatusCodes.CONFLICT, "User already exists");
  }
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      profile: {
        create: {
          profilePhoto,
          bio,
        },
      },
    },
  });

  //   await prisma.profile.create({
  //     data: {
  //       profilePhoto,
  //       bio,
  //       userId: user.id,
  //     },
  //   });

  const result = await prisma.user.findUnique({
    where: {
      email: email,
      id: user.id,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return result;
};

const getMeFromDB = async (id: string) => {
  const me = await prisma.user.findUnique({
    where: { id },
    omit: { password: true },
    include: { profile: true },
  });
  return me;
};

const updateProfileIntoDB = async (
  id: string,
  userUpdateData?: Prisma.UserUpdateInput,
  profileUpdateData?: ProfileUpdateInput,
) => {
  return prisma.$transaction(async (tnx) => {
    if (userUpdateData) {
      await tnx.user.update({
        where: {
          id: id,
        },
        data: userUpdateData,
      });
    }
    if (profileUpdateData) {
      await tnx.profile.update({
        where: { userId: id },
        data: profileUpdateData,
      });
    }

    return await tnx.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
      },
      omit: {
        password: true,
      },
    });
  });
};

export const UserService = {
  registerUserIntoDB,
  getMeFromDB,
  updateProfileIntoDB,
};
