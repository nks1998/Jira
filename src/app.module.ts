import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { BoardsModule } from './boards/boards.module';
import { ColumnModule } from './column/column.module';
import { IssuesModule } from './issues/issues.module';
import { CommentsModule } from './comments/comments.module';
import { SprintsModule } from './sprints/sprints.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    BoardsModule,
    ColumnModule,
    IssuesModule,
    CommentsModule,
    SprintsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
