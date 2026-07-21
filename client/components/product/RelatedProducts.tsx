import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import products from "@/data/products.json";
import { ProductType } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

interface RelatedProductsProps {
  products: ProductType;
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  console.log(products)
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">Related Products</h2>
        <Button variant="ghost" asChild>
          <Link href="/" className="text-primary hover:text-primary/80">
            View All
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products && products
          ?.map((relatedProduct) => (
            <Card
              key={relatedProduct._id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/product/${relatedProduct.id}`}>
                <div className="aspect-square overflow-hidden bg-muted">
                  <Image
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-1 mb-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-lg font-bold text-primary">
                    ${relatedProduct.price.toFixed(2)}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
      </div>
    </div>
  );
}
