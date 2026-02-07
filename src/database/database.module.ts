import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/db.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
