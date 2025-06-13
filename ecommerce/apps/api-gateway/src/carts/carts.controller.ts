import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartCreateDTO, UpdateCartDTO } from 'y/dtos';
import { Request } from 'express';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post('')
  addToCart(@Body() createCartDto: CartCreateDTO, @Req() req: Request) {
    createCartDto.user_id = req.headers['x-client-id'] as string;
    return this.cartsService.addToCart(createCartDto);
  }

  @Get('')
  getCartByUser(@Req() req: Request) {
    const user_id = req.headers['x-client-id'] as string;
    return this.cartsService.getCartByUser(user_id);
  }

  @Delete(':id')
  deleteCartItem(@Param('id') id: string) {
    return this.cartsService.delete(id);
  }

  @Post('update')
  update(@Body() updateCartDto: UpdateCartDTO, @Req() req: Request) {
    updateCartDto.user_id = req.headers['x-client-id'] as string;
    return this.cartsService.update(updateCartDto);
  }

  @Post('selected')
  selected(@Body() updateCartDto: { id: string; isSelected: boolean }) {
    return this.cartsService.selected(updateCartDto);
  }
}
