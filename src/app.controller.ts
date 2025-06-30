import { Controller, Get, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    res.render('index', {
      title: 'Welcome to NestJS',
      name: 'John Doe..',
    });
  }

  @Get()
  @Render('index') // views/index.ejs
  getHome() {
    return {}; // You can pass data to the view here
  }
}
