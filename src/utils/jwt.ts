// import { JwtService } from '@nestjs/jwt';


// export const signToken = (
//     id: number,
//     email: string,
//   ): Promise<{ access_token: string }> =>{
//     const payload = {
//       sub: id,
//       email,
//     };
//     const secret = process.env.JWT_SECRET;

//     const Token = await JwtService.signAsync(payload, {
//       expiresIn: '15d',
//       secret: secret,
//     });

//     return {
//       access_token: Token,
//     };
//   }
// }