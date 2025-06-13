import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document, model, Types } from 'mongoose';
import { SlugService } from 'nestjs-slug';

@Schema({ collection: 'Spus', timestamps: true })
export class Spu extends Document {
  @Prop({ type: String, default: '', index: true })
  product_id: string;

  @Prop({ required: true })
  product_name: string;

  @Prop({ required: true })
  product_thumb: string;

  @Prop()
  product_description: string;

  @Prop()
  product_slug: string;

  @Prop({ required: true })
  product_price: number;

  // @Prop({ type: Array, default: [] })
  // product_category: string[];
  @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
  product_category: Types.ObjectId[];

  @Prop({ required: true })
  product_quantity: number;

  @Prop({ type: String })
  product_shop: String;

  @Prop({ type: Map, of: String, required: true })
  product_attributes: Record<string, any>;

  @Prop({
    type: Number,
    default: 4.5,
    min: 1,
    max: 5,
    set: (val: number) => Math.round(val * 10) / 10,
  })
  product_ratingsAverage: number;

  @Prop({ type: Array, default: [] })
  product_variations: any[];

  @Prop({ type: Boolean, default: true, index: true, select: false })
  isDraft: boolean;

  @Prop({ type: Boolean, default: false, index: true, select: false })
  isPublished: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}
// Schema Factory
export const SpuSchema = SchemaFactory.createForClass(Spu);

export const SpuModel = model<Spu>('Spus', SpuSchema);

// Tạo Index cho product_name và product_description
SpuSchema.index({ product_name: 'text', product_description: 'text' });

const slugService = new SlugService();
// Middleware để tạo slug trước khi lưu
SpuSchema.pre('save', function (next) {
  if (!this.product_slug) {
    this.product_slug = slugService.generateSlug(this.product_name, {
      lowerCase: true,
    });
  }
  this.product_id = randomUUID();
  next();
});
