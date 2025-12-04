import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProductStore } from "@/store/product.store";
import { useCategoryStore } from "@/store/category.store";
import { useSubcategoryStore } from "@/store/subcategory.store";

export default function EditProductDialog({ open, onClose, slug, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discountPrice: "",
    gstSlab: "18", // ✅ default GST Slab
    sku: "",
    stock: "",
    description: "",
    category: "",
    subcategory: "",
    newImages: [],
<<<<<<< HEAD
  });

  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
=======
    newVideos: [], // Add newVideos field
  });

  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]); // Add existingVideos state
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [videosToRemove, setVideosToRemove] = useState([]); // Add videosToRemove state
>>>>>>> 460700d960a77f96500b74421728d156211c487a

  const { products, editProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { subcategories, fetchSubcategories } = useSubcategoryStore();

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    if (!slug || !open) return;

    const product = Array.isArray(products)
      ? products.find((p) => p.slug === slug)
      : (products?.products || []).find((p) => p.slug === slug);

    if (product) {
      setFormData({
        title: product.title || "",
        price: product.price || "",
        discountPrice: product.discountPrice || "",
        gstSlab: String(product.gstSlab ?? 18), // ✅ default to 18 if undefined
        sku: product.sku || "",
        stock: product.stock || "",
        description: product.description || "",
        category: product.category?._id || "",
        subcategory: product.subcategory?._id || "",
        newImages: [],
<<<<<<< HEAD
      });
      setExistingImages(product.images || []);
      setImagesToRemove([]);
=======
        newVideos: [], // Initialize newVideos
      });
      setExistingImages(product.images || []);
      setExistingVideos(product.videos || []); // Set existing videos
      setImagesToRemove([]);
      setVideosToRemove([]); // Initialize videosToRemove
>>>>>>> 460700d960a77f96500b74421728d156211c487a
    }
  }, [slug, open, products]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, newImages: e.target.files }));
  };

<<<<<<< HEAD
=======
  const handleVideoChange = (e) => {
    setFormData((prev) => ({ ...prev, newVideos: e.target.files }));
  };

>>>>>>> 460700d960a77f96500b74421728d156211c487a
  const removeExistingImage = (index) => {
    const removed = existingImages[index];
    setImagesToRemove((prev) => [...prev, removed]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

<<<<<<< HEAD
=======
  const removeExistingVideo = (index) => {
    const removed = existingVideos[index];
    setVideosToRemove((prev) => [...prev, removed]);
    setExistingVideos((prev) => prev.filter((_, i) => i !== index));
  };

>>>>>>> 460700d960a77f96500b74421728d156211c487a
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("price", formData.price);
      uploadData.append("discountPrice", formData.discountPrice || 0);
      uploadData.append("gstSlab", formData.gstSlab || 18);
      uploadData.append("sku", formData.sku || "");
      uploadData.append("stock", formData.stock);
      uploadData.append("description", formData.description);
      uploadData.append("slug", slug);

      if (formData.category) uploadData.append("category", formData.category);
      if (formData.subcategory)
        uploadData.append("subcategory", formData.subcategory);

      // Removed images
      imagesToRemove.forEach((img) => uploadData.append("imagesToRemove", img));
<<<<<<< HEAD
=======
      
      // Removed videos
      videosToRemove.forEach((vid) => uploadData.append("videosToRemove", vid));
>>>>>>> 460700d960a77f96500b74421728d156211c487a

      // Existing images
      existingImages.forEach((imgUrl) =>
        uploadData.append("existingImages", imgUrl)
      );
<<<<<<< HEAD
=======
      
      // Existing videos
      existingVideos.forEach((vidUrl) =>
        uploadData.append("existingVideos", vidUrl)
      );
>>>>>>> 460700d960a77f96500b74421728d156211c487a

      // New images
      if (formData.newImages?.length > 0) {
        Array.from(formData.newImages).forEach((img) => {
          uploadData.append("images", img);
        });
      }

<<<<<<< HEAD
=======
      // New videos
      if (formData.newVideos?.length > 0) {
        Array.from(formData.newVideos).forEach((video) => {
          uploadData.append("video", video);
        });
      }

>>>>>>> 460700d960a77f96500b74421728d156211c487a
      await editProduct(slug, uploadData);
      toast.success("Product updated successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error("Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] bg-white rounded-2xl shadow-xl p-0 overflow-hidden">
        <div className="flex flex-col max-h-[90vh]">
          {/* Fixed Header */}
          <div className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-white z-20">
            <DialogTitle className="text-[#02066F] text-2xl font-bold tracking-tight">
              Edit Product
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-[#02066F] text-xl font-semibold"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Form Area */}
          <div className="overflow-y-auto px-6 py-4 flex-1">
            {loading ? (
              <p className="p-4 text-center text-gray-500">Loading...</p>
            ) : (
              <form
                id="edit-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {/* Title */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Title
                  </Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>

                {/* Price */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    MRP
                  </Label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>

                {/* Discount Price */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Discount Price
                  </Label>
                  <Input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>

                {/* GST Slab */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    GST Slab (%)
                  </Label>
                  <select
                    name="gstSlab"
                    value={formData.gstSlab}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>

                {/* SKU */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    SKU
                  </Label>
                  <Input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>

                {/* Stock */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Stock
                  </Label>
                  <Input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Category
                  </Label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Subcategory
                  </Label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories
                      ?.filter((sub) => sub.category?._id === formData.category)
                      .map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Description */}
                <div className="col-span-1 sm:col-span-2">
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Description
                  </Label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md min-h-[100px] focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>

                {/* Current Images */}
                {existingImages.length > 0 && (
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-700 mb-2 block">
                      Current Images
                    </Label>
                    <div className="flex flex-wrap gap-3">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24">
                          <img
                            src={img}
                            className="w-full h-full object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs bg-red-600 hover:bg-red-700 text-white shadow-md"
                            onClick={() => removeExistingImage(idx)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Images */}
                <div className="col-span-2">
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Add / Replace Images
                  </Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>
<<<<<<< HEAD
=======
                
                {/* Current Videos */}
                {existingVideos.length > 0 && (
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-700 mb-2 block">
                      Current Videos
                    </Label>
                    <div className="flex flex-wrap gap-3">
                      {existingVideos.map((vid, idx) => (
                        <div key={idx} className="relative w-24 h-24">
                          <video
                            src={vid}
                            className="w-full h-full object-cover rounded-md border"
                            muted
                            preload="metadata"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs bg-red-600 hover:bg-red-700 text-white shadow-md"
                            onClick={() => removeExistingVideo(idx)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Add Videos */}
                <div className="col-span-2">
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Add / Replace Videos
                  </Label>
                  <Input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>
>>>>>>> 460700d960a77f96500b74421728d156211c487a
              </form>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="border-t bg-white px-6 py-4 flex justify-end gap-3 sticky bottom-0 z-20">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-form"
              disabled={loading}
              className="bg-[#02066F] hover:bg-[#04127A] text-white"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
