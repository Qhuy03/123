import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model, Types } from 'mongoose';
import { SlugService } from 'nestjs-slug';

@Schema({ collection: 'Categories', timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true, index: true })
  category_name: string;

  @Prop()
  category_description: string;

  @Prop()
  category_slug: string;

  @Prop({ type: String })
  category_thumb: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parent_category: Types.ObjectId | null;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

// Schema Factory
export const CategorySchema = SchemaFactory.createForClass(Category);

// Tạo slug và validate trước khi lưu
const slugService = new SlugService();
CategorySchema.pre('save', function (next) {
  if (!this.category_slug && this.category_name) {
    this.category_slug = slugService.generateSlug(this.category_name, {
      lowerCase: true,
    });
  }
  next();
});

// Tạo chỉ mục tìm kiếm text
CategorySchema.index({ category_name: 'text', category_description: 'text' });

export const CategoryModel = model<Category>('Categories', CategorySchema);
