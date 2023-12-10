import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthToken {
  @Field()
  token_type: string;

  @Field()
  access_token: string;

  @Field()
  refresh_token: string;
}
