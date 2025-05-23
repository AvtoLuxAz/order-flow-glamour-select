
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, ProductFormData } from '@/models/product.model';
import { productService } from '@/services';
import { useToast } from '@/hooks/use-toast';

export const useProductActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createProductMutation = useMutation<Product | null, Error, ProductFormData>({
    mutationFn: async (productData: ProductFormData) => {
      const response = await productService.create(productData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Məhsul yaradıldı",
        description: "Məhsul uğurla əlavə edildi"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: error.message || 'Məhsul yaradılarkən xəta baş verdi'
      });
    }
  });

  const updateProductMutation = useMutation<Product | null, Error, { id: string | number; productData: Partial<ProductFormData> }>({
    mutationFn: async ({ id, productData }) => {
      const response = await productService.update(id, productData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || null;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', id] });
      toast({
        title: "Məhsul yeniləndi",
        description: "Məhsul uğurla yeniləndi"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: error.message || 'Məhsul yenilərkən xəta baş verdi'
      });
    }
  });

  const deleteProductMutation = useMutation<boolean, Error, string | number>({
    mutationFn: async (id: string | number) => {
      const response = await productService.delete(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return true;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', id] });
      toast({
        title: "Məhsul silindi",
        description: "Məhsul uğurla silindi"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: error.message || 'Məhsul silinərkən xəta baş verdi'
      });
    }
  });

  return {
    createProduct: createProductMutation.mutateAsync,
    isCreatingProduct: createProductMutation.isPending,
    createProductError: createProductMutation.error,

    updateProduct: updateProductMutation.mutateAsync,
    isUpdatingProduct: updateProductMutation.isPending,
    updateProductError: updateProductMutation.error,

    deleteProduct: deleteProductMutation.mutateAsync,
    isDeletingProduct: deleteProductMutation.isPending,
    deleteProductError: deleteProductMutation.error,
  };
};
