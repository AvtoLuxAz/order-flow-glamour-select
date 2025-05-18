import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database } from "@/lib/database.types";

const MAX_BENEFITS = 6;

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  duration: z.number().int().min(1, "Duration must be at least 1 minute"),
  price: z.number().min(0, "Price must be positive"),
  image_url: z.string().optional(),
  product_ids: z.array(z.string()).optional(),
  benefits: z
    .array(z.string())
    .max(MAX_BENEFITS, `Maximum ${MAX_BENEFITS} benefits allowed`),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

type Product = Database["public"]["Tables"]["products"]["Row"];

export function ServiceForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [benefits, setBenefits] = useState<string[]>([]);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 60,
      price: 0,
      product_ids: [],
      benefits: [],
    },
  });

  const onSubmit = async (data: ServiceFormData) => {
    try {
      let imageUrl = data.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("service-images")
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        imageUrl = uploadData.path;
      }
      const { error } = await supabase.from("services").insert({
        ...data,
        image_url: imageUrl,
      });
      if (error) throw error;
      form.reset();
      setBenefits([]);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      form.setValue("image_url", file.name);
    }
  };

  const addBenefit = () => {
    if (benefits.length < MAX_BENEFITS) {
      setBenefits([...benefits, ""]);
      form.setValue("benefits", [...benefits, ""]);
    }
  };

  const removeBenefit = (index: number) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(newBenefits);
    form.setValue("benefits", newBenefits);
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
    form.setValue("benefits", newBenefits);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-xl mx-auto p-4 bg-white rounded-lg shadow-md"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Service name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Description (optional)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      placeholder="60"
                    />
                    <span className="text-gray-500">dəq.</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      placeholder="0"
                    />
                    <span className="text-gray-500">₼</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </FormControl>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Service preview"
                  className="mt-2 h-32 w-32 object-cover rounded-md"
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="product_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Products</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  multiple
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select products" />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <FormLabel>Benefits</FormLabel>
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={benefit}
                onChange={(e) => updateBenefit(index, e.target.value)}
                placeholder={`Benefit ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBenefit(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {benefits.length < MAX_BENEFITS && (
            <Button
              type="button"
              variant="outline"
              onClick={addBenefit}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Benefit
            </Button>
          )}
        </div>
        <Button type="submit" className="w-full">
          Create Service
        </Button>
      </form>
    </Form>
  );
}
