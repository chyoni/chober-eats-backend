import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

//Repository를 Custom할 수 있다.

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async getOrCreate(name: string): Promise<Category> {
    const categoryName = name.trim().toLowerCase();
    const categorySlug = categoryName.replace(/ /g, '-');
    let category = await this.findOne({ slug: categorySlug });
    if (category) {
      return category;
    } else {
      category = await this.save(
        this.create({
          name: categoryName,
          slug: categorySlug,
        }),
      );
      return category;
    }
  }
}
