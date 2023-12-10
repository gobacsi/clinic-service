import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Otp {
  @Field()
  expiresIn: number;

  @Field()
  code: string;
}
