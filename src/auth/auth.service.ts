import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { MailService } from './mail.service';
@Injectable()
export class AuthService {


  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
      private mailService: MailService,

  ) {}



  async signup(data: SignupDto) {

    const {
      username,
      email,
      password,
      confirmPassword
    } = data;



    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }



  const existingUser =
  await this.prisma.user.findUnique({
    where:{
      email,
    },
  });


if(existingUser){

  throw new Error('Email already exists');

}



// Check pending verification

const existingPending =
  await this.prisma.pendingVerification.findUnique({

    where:{
      email,
    },

  });




    const hashedPassword =
      await bcrypt.hash(password,10);



 const otp =
  Math.floor(100000 + Math.random() * 900000).toString();


let pendingUser;


if(existingPending){

  pendingUser =
    await this.prisma.pendingVerification.update({

      where:{
        email,
      },

      data:{

        name: username,

        password: hashedPassword,

        otp,

        otpExpiry: new Date(Date.now() + 10 * 60 * 1000),

      },

    });


}

  pendingUser =
    await this.prisma.pendingVerification.create({

      data:{
        name: username,
        email,
        password: hashedPassword,
        otp,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      },

    });

}


console.log("GENERATED OTP:", otp);


// await this.mailService.sendVerificationOtp(
//   email,
//   otp,
// );


return {

  message:'OTP sent to your email',

  email: pendingUser.email,

};


  async login(email:string,password:string){


 let user =
  await this.prisma.user.findUnique({
    where:{
      email,
    },
  });


console.log("EMAIL CHECK:", email);

const allUsers = await this.prisma.user.findMany({
  where:{
    email,
  }
});

console.log("USERS FOUND:", allUsers);


    if(!user){

      throw new Error('User not found');

    }



    if(!user.password){

      throw new Error('Please login with Google');

    }



    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password,
      );



    if(!isPasswordValid){

      throw new Error('Invalid password');

    }





    const subscription =
      await this.prisma.subscription.findUnique({

        where:{
          userId:user.id,
        },

      });




const token = this.jwtService.sign({
  id: user.id,
  email: user.email,
  name: user.name,
});



    return {

      message:'Login successful',

      accessToken:token,

      subscribed:!!subscription,


      user:{

        id:user.id,

        name:user.name,

        email:user.email,

      },

    };

  }

async verifyOtp(
  email: string,
  otp: string,
) {

  const pendingUser =
    await this.prisma.pendingVerification.findUnique({
      where:{
        email,
      },
    });


  if(!pendingUser){
    throw new Error('Verification request not found');
  }


  if(pendingUser.otp !== otp){
    throw new Error('Invalid OTP');
  }


  if(pendingUser.otpExpiry < new Date()){
    throw new Error('OTP expired');
  }


  const user =
    await this.prisma.user.create({
      data:{
        name: pendingUser.name,
        email: pendingUser.email,
        password: pendingUser.password,
      },
    });


  await this.prisma.pendingVerification.delete({
    where:{
      email,
    },
  });


  return {
    message:'Account created successfully',
    verified:true,
    user,
  };

}
  
async forgotPassword(email: string) {

  const user = await this.prisma.user.findUnique({
    where: {
      email
    }
  });


  if (!user) {
    throw new Error('User not found');
  }


  const token = randomBytes(32).toString('hex');


  await this.prisma.user.update({
    where: {
      email
    },
    data: {
      resetToken: token,
      resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000)
    }
  });

console.log("TOKEN:", token);
  await this.mailService.sendResetPasswordEmail(
    email,
    token
  );


  return {
    message: "Password reset link has been sent to your email"
  };

}

async resetPassword(
  token: string,
  newPassword: string,
) {

  const user = await this.prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });


  if (!user) {
    throw new Error('Invalid or expired token');
  }


  const hashedPassword =
    await bcrypt.hash(newPassword, 10);


  await this.prisma.user.update({

    where: {
      id: user.id,
    },

    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },

  });


  return {
    message: 'Password reset successfully',
  };

}

async changePassword(
  email: string,
  currentPassword: string,
  newPassword: string,
) {

  const user = await this.prisma.user.findUnique({
    where: {
      email,
    },
  });


  if (!user) {
    throw new Error('User not found');
  }


  // Google users ke liye
  if (!user.password) {
    throw new Error('Password not set for this account');
  }


  const passwordMatch = await bcrypt.compare(
    currentPassword,
    user.password,
  );


  if (!passwordMatch) {
    throw new Error('Current password is incorrect');
  }


  const hashedPassword = await bcrypt.hash(
    newPassword,
    10,
  );


  await this.prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });


  return {
    message: 'Password updated successfully',
  };

}

  // GOOGLE LOGIN

  async googleLogin(googleUser:any){


    const {
      email,
      name,
      googleId
    } = googleUser;




    let user =
      await this.prisma.user.findUnique({

        where:{
          email,
        },

      });





    // New Google user

    if(!user){


      user =
        await this.prisma.user.create({

          data:{

            name,

            email,

            googleId,

            password:null,

          },

        });


    }





    const subscription =
      await this.prisma.subscription.findUnique({

        where:{
          userId:user.id,
        },

      });

console.log("GOOGLE LOGIN USER:", user.email);
console.log("USER ID:", user.id);
console.log("FOUND SUBSCRIPTION:", subscription);




   const token =
  this.jwtService.sign({

    id:user.id,

    email:user.email,

    name:user.name,

  });





    return {


      message:'Google login successful',


      accessToken:token,


      subscribed:!!subscription,



      user:{

        id:user.id,

        name:user.name,

        email:user.email,

      },


    };


  }


}
