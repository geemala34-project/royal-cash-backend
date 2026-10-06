import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SliderService } from './slider.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/slider')
export class SliderController {
  constructor(private sliderService: SliderService) {}

  @Get()
  getSlides() {
    return this.sliderService.getSlides();
  }

  @Post()
  @UseGuards(AdminGuard)
  createSlide(@Body() body: { imageUrl: string; title?: string; sortOrder?: number }) {
    return this.sliderService.createSlide(body);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  updateSlide(@Param('id') id: string, @Body() body: any) {
    return this.sliderService.updateSlide(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  deleteSlide(@Param('id') id: string) {
    return this.sliderService.deleteSlide(id);
  }
}
