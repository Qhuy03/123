import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';

@Schema({ collection: 'Skus', timestamps: true })
export class Sku extends Document {
  @Prop({ required: true })
  sku_id: string;

  @Prop({ type: [Number], default: [0] })
  sku_tier_idx: number[];

  @Prop({ default: false })
  sku_default: boolean;

  @Prop({ default: '' })
  sku_thumb: string;

  @Prop({ default: '' })
  sku_slug: string;

  @Prop({ default: 0 })
  sku_sort: number;

  @Prop({ required: true })
  sku_price: number;

  @Prop({ default: 0 })
  sku_stock: number;

  @Prop({ required: true, index: true })
  product_id: string;

  @Prop({ type: Boolean, default: true, index: true, select: false })
  isDraft: boolean;

  @Prop({ type: Boolean, default: false, index: true, select: false })
  isPublished: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

// Schema Factory
export const SkuSchema = SchemaFactory.createForClass(Sku);

export const SkuModel = model<Sku>('Skus', SkuSchema);
