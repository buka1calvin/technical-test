import { Product } from "@/src/models/product.model";

export interface ProductFilters {
  userId: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'name' | 'amount' | 'createdAt' | 'position';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  skip?: number;
}

export class ProductQueryBuilder {
  private query: any = {};
  private sortOptions: any = {};
  private limitValue?: number;
  private skipValue?: number;

  constructor(private userId: string) {
    this.query.userId = userId;
  }

  search(searchTerm: string) {
    if (searchTerm && searchTerm.trim()) {
      this.query.name = {
        $regex: searchTerm.trim(),
        $options: 'i'
      };
    }
    return this;
  }

  amountRange(min?: number, max?: number) {
    if (min !== undefined || max !== undefined) {
      this.query.amount = {};
      if (min !== undefined) this.query.amount.$gte = min;
      if (max !== undefined) this.query.amount.$lte = max;
    }
    return this;
  }

  dateRange(startDate?: Date, endDate?: Date) {
    if (startDate || endDate) {
      this.query.createdAt = {};
      if (startDate) this.query.createdAt.$gte = startDate;
      if (endDate) this.query.createdAt.$lte = endDate;
    }
    return this;
  }

  sort(field: 'name' | 'amount' | 'createdAt' | 'position', order: 'asc' | 'desc' = 'asc') {
    this.sortOptions[field] = order === 'asc' ? 1 : -1;
    return this;
  }

  defaultSort() {
    this.sortOptions = { position: 1, createdAt: 1 };
    return this;
  }

  paginate(page: number, limit: number) {
    this.limitValue = limit;
    this.skipValue = (page - 1) * limit;
    return this;
  }

  async execute() {
    let mongoQuery = Product.find(this.query);

    if (Object.keys(this.sortOptions).length > 0) {
      mongoQuery = mongoQuery.sort(this.sortOptions);
    } else {
      mongoQuery = mongoQuery.sort({ position: 1, createdAt: 1 });
    }

    if (this.skipValue !== undefined) {
      mongoQuery = mongoQuery.skip(this.skipValue);
    }
    if (this.limitValue !== undefined) {
      mongoQuery = mongoQuery.limit(this.limitValue);
    }

    return mongoQuery.lean();
  }

  async count() {
    return Product.countDocuments(this.query);
  }

  async getStats() {
    const stats = await Product.aggregate([
      { $match: this.query },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
          maxAmount: { $max: '$amount' },
          minAmount: { $min: '$amount' }
        }
      }
    ]);

    return stats[0] || {
      totalProducts: 0,
      totalAmount: 0,
      averageAmount: 0,
      maxAmount: 0,
      minAmount: 0
    };
  }
}

export const createProductQuery = (userId: string) => {
  return new ProductQueryBuilder(userId);
};
