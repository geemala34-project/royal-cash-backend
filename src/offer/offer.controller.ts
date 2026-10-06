import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OfferService } from './offer.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/offer')
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Get()
  getOffers() {
    return this.offerService.getOffers();
  }

  @Post()
  @UseGuards(AdminGuard)
  createOffer(@Body() body: { type: string; content?: string; imageUrl?: string }) {
    return this.offerService.createOffer(body);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  updateOffer(@Param('id') id: string, @Body() body: any) {
    return this.offerService.updateOffer(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  deleteOffer(@Param('id') id: string) {
    return this.offerService.deleteOffer(id);
  }
}
