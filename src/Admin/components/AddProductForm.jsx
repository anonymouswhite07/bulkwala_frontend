import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useProductStore } from "../../store/product.store.js";
import { useCategoryStore } from "../../store/category.store.js";
import { useSubcategoryStore } from "../../store/subcategory.store.js";
import { productSchema } from "../../schemas/productSchema.js";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const AddProductForm = ({ onSuccess }) => {
  const { addProduct, loading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { subcategories, fetchSubcategories } = useSubcategoryStore();

  const [previewUrls, setPreviewUrls] = useState([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: "",
      discountPrice: "",
      stock: "",
      category: "",
      subcategory: "",
      tags: [],
      images: [],
      isActive: true,
      isFeatured: false,
      sku: "",
      color: [],
      genericName: "",
      manufacturerName: "",
      countryOfOrigin: "India",
      videos: [], // Changed from single video to array
    },
  });

  const categoryValue = watch("category");

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, [fetchCategories, fetchSubcategories]);

  const onSubmit = async (data) => {
    console.log("🔍 Form Data before sending:", data);

    try {
      await addProduct(data);
      toast.success("Product added successfully!");
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    }
  };

  // ✅ Filter subcategories by category
  const filteredSubcategories = categoryValue
    ? subcategories.filter(
        (sc) => String(sc.category?._id) === String(categoryValue)
      )
    : [];

  return (
    <Card className="mb-6">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <Input
            type="text"
            placeholder="Product Title"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
          {/* Slug */}
          <Input
            type="text"
            placeholder="Slug (optional)"
            {...register("slug")}
          />
          {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
          {/* Description */}
          <Input
            type="text"
            placeholder="Product Description"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
          {/* Price */}
          <Input type="number" placeholder="MRP" {...register("price")} />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
          {/* ✅ Discount Price  */}
          <Input
            type="number"
            placeholder="Discount Price"
            {...register("discountPrice")}
          />
          {errors.discountPrice && (
            <p className="text-red-500">{errors.discountPrice.message}</p>
          )}
          {/* Stock */}
          <Input type="number" placeholder="Stock" {...register("stock")} />
          {errors.stock && (
            <p className="text-red-500">{errors.stock.message}</p>
          )}
          {/* SKU */}
          <Input type="text" placeholder="SKU" {...register("sku")} />
          {errors.sku && <p className="text-red-500">{errors.sku.message}</p>}
          {/* Color */}
          <Input
            type="text"
            placeholder="Colors (comma separated)"
            {...register("color")}
          />
          {errors.color && (
            <p className="text-red-500">{errors.color.message}</p>
          )}
          {/* Generic Name */}
          <Input
            type="text"
            placeholder="Generic Name"
            {...register("genericName")}
          />
          {errors.genericName && (
            <p className="text-red-500">{errors.genericName.message}</p>
          )}
          {/* Country of Origin */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Country of Origin
            </label>
            <Select
              onValueChange={(value) => setValue("countryOfOrigin", value)}
              defaultValue="India"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="China">China</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.countryOfOrigin && (
            <p className="text-red-500">{errors.countryOfOrigin.message}</p>
          )}
          {/* Manufacturer Name */}
          <Input
            type="text"
            placeholder="Manufacturer Name"
            {...register("manufacturerName")}
          />
          {errors.manufacturerName && (
            <p className="text-red-500">{errors.manufacturerName.message}</p>
          )}
          {/* ✅ GST Slab  */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              GST Slab (%)
            </label>
            <Select
              onValueChange={(value) => setValue("gstSlab", Number(value))}
              defaultValue="18"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select GST Slab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0%</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="28">28%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.gstSlab && (
            <p className="text-red-500">{errors.gstSlab.message}</p>
          )}
          {/* Video Upload */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Product Videos (Multiple)
            </label>
            <Input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setValue("videos", files, { shouldValidate: true });
                setVideoPreviewUrls(files.map((file) => URL.createObjectURL(file)));
              }}
            />
            {errors.videos && (
              <p className="text-red-500">{errors.videos.message}</p>
            )}
            
            {/* Video Previews */}
            <div className="mt-2 flex gap-2 flex-wrap">
              {videoPreviewUrls.map((url, idx) => (
                <div key={idx} className="relative">
                  <video
                    src={url}
                    className="w-20 h-20 object-cover rounded border"
                    muted
                    preload="metadata"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newUrls = [...videoPreviewUrls];
                      newUrls.splice(idx, 1);
                      setVideoPreviewUrls(newUrls);
                      
                      const currentVideos = getValues("videos");
                      const newVideos = [...currentVideos];
                      newVideos.splice(idx, 1);
                      setValue("videos", newVideos);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Images Upload */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Product Images
            </label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setValue("images", files, { shouldValidate: true });
                setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
              }}
            />
            {errors.images && (
              <p className="text-red-500">{errors.images.message}</p>
            )}

            <div className="mt-2 flex gap-2 flex-wrap">
              {previewUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="Preview"
                  className="h-20 object-cover rounded-md border"
                />
              ))}
            </div>
          </div>
          {/* Tags */}
          <Input
            type="text"
            placeholder="Tags (comma separated)"
            {...register("tags")}
          />
          {errors.tags && <p className="text-red-500">{errors.tags.message}</p>}
          {/* Category Dropdown */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Category</label>
            <Select
              onValueChange={(value) => setValue("category", value)}
              value={categoryValue}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}
          </div>
          {/* Subcategory Dropdown */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Subcategory
            </label>
            <Select
              onValueChange={(value) => setValue("subcategory", value)}
              value={watch("subcategory")}
              disabled={!categoryValue}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubcategories.map((sub) => (
                  <SelectItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subcategory && (
              <p className="text-red-500">{errors.subcategory.message}</p>
            )}
          </div>
          {/* Active / Featured checkboxes */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isActive")} defaultChecked />
              Active
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isFeatured")} />
              Featured
            </label>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
