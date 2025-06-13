import { Controller, Get } from '@nestjs/common';
import { CartsService } from './carts.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartCreateDTO, UpdateCartDTO } from 'y/dtos';

@Controller()
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @MessagePattern('cart.add')
  addToCart(@Payload() data: CartCreateDTO) {
    return this.cartsService.addToCart(data);
  }

  @MessagePattern('cart.get')
  getCartByUser(@Payload() user_id: string) {
    return this.cartsService.getCartByUser(user_id);
  }

  @MessagePattern('cart.update')
  updateCart(@Payload() data: UpdateCartDTO) {
    return this.cartsService.updateCart(data);
  }

  @MessagePattern('cart.delete')
  deleteCart(@Payload() id: string) {
    return this.cartsService.removeItem(id);
  }

  @MessagePattern('cart.selected')
  selectedCart(@Payload() data: { id: string; isSelected: boolean }) {
    return this.cartsService.selected(data);
  }
}
