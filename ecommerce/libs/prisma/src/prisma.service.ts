import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as ORDER } from './generated/order';
import { PrismaClient as AUTH } from './generated/auth';
import { PrismaClient as CART } from './generated/cart';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  OrderClient = new ORDER();
  AuthClient = new AUTH({
    log: ['info'],
  });
  CartClient = new CART();

  async onModuleInit() {
    console.log('Connecting to Prisma Clients...');
    try {
      await this.OrderClient.$connect();
      console.log('OrderClient connected');
    } catch (error) {
      console.error('Error connecting to OrderClient:', error);
    }

    try {
      await this.AuthClient.$connect();
      console.log('AuthClient connected');
    } catch (error) {
      console.error('Error connecting to AuthClient:', error);
    }

    try {
      await this.CartClient.$connect();
      console.log('CartClient connected');
    } catch (error) {
      console.error('Error connecting to CartClient:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.OrderClient.$disconnect();
      console.log('OrderClient disconnected');
    } catch (error) {
      console.error('Error disconnecting from OrderClient:', error);
    }

    try {
      await this.AuthClient.$disconnect();
      console.log('AuthClient disconnected');
    } catch (error) {
      console.error('Error disconnecting from AuthClient:', error);
    }

    try {
      await this.CartClient.$disconnect();
      console.log('CartClient disconnected');
    } catch (error) {
      console.error('Error disconnecting from CartClient:', error);
    }
  }
}
