import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Attribute, AttributeSchema } from './entities/attribute.entity';
import { AttributeController } from './attribute.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attribute.name, schema: AttributeSchema },
    ]),
  ],
  providers: [AttributeService],
  controllers: [AttributeController],
  exports: [AttributeService],
})
export class AttributeModule {}
