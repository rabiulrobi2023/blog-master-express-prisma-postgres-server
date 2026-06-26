import bcrypt from "bcryptjs";
import { RegisterUserPayload } from "./user.interface";
import env from "../../../config";
import { prisma } from "../../../lib/prisma";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, role, bio, profilePhoto } = payload;
  console.log(name, email, password);

  const hashedPassword = await bcrypt.hash(
    password,
    Number(env.BCRYPT_SALT_ROUND),
  );

  console.log(hashedPassword);

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (isUserExist) {
    throw new Error("User already exist");
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

export const UserService = {
  registerUserIntoDB,
};
