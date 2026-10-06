import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/payment-methods')
export class PaymentMethodController {
  constructor(private paymentMethodService: PaymentMethodService) {}

  @Get()
  getActiveMethods() {
    return this.paymentMethodService.getActiveMethods();
  }

  @Get('all')
  @UseGuards(AdminGuard)
  getAllMethods() {
    return this.paymentMethodService.getAllMethods();
  }

  @Post()
  @UseGuards(AdminGuard)
  createMethod(@Body() body: { name: string; details: string }) {
    return this.paymentMethodService.createMethod(body);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  updateMethod(@Param('id') id: string, @Body() body: any) {
    return this.paymentMethodService.updateMethod(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  deleteMethod(@Param('id') id: string) {
    return this.paymentMethodService.deleteMethod(id);
  }
}
