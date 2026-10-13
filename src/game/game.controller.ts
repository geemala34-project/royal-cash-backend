import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/games')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  getActiveGames() {
    return this.gameService.getActiveGames();
  }

  @Get('all')
  @UseGuards(AdminGuard)
  getAllGames() {
    return this.gameService.getAllGames();
  }

  @Post()
  @UseGuards(AdminGuard)
  createGame(@Body() body: any) {
    return this.gameService.createGame(body);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  updateGame(@Param('id') id: string, @Body() body: any) {
    return this.gameService.updateGame(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  deleteGame(@Param('id') id: string) {
    return this.gameService.deleteGame(id);
  }
}
