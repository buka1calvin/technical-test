import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDebounce } from "use-debounce";
import {
  Plus,
  Package,
  Calendar,
  Hash,
  MessageSquare,
  Search,
  Edit2,
  Trash2,
  Save,
  X,
} from "lucide-react";
import Container from "@/src/layout/container.layout";
import Toolbar from "@/src/layout/toolbar.layout";
import Card from "@/src/layout/card.layout";
import Button from "@/src/layout/button.layout";
import Input from "@/src/layout/input.layout";
import Textarea from "@/src/layout/textarea.layout";
import Loading from "@/src/layout/loader.layout";
import Typography from "@/src/layout/typography.layout";
import EmptyState from "@/src/layout/empty-state.layout";
import ProductCreationModal from "@/src/layout/product-modal.layout";
import { useProducts, useProductActions } from "@/src/hooks/products.hook";
import { useProductModal } from "@/src/hooks/product-modal.hook";
import { Product } from "@/src/types/types";

const ITEMS_PER_PAGE = 10;

const sortOptions = [
  { label: "Newest First", value: "createdAt_desc", icon: Calendar },
  { label: "Oldest First", value: "createdAt_asc", icon: Calendar },
  { label: "Name A-Z", value: "name_asc", icon: Package },
  { label: "Name Z-A", value: "name_desc", icon: Package },
  { label: "Amount High-Low", value: "amount_desc", icon: Hash },
  { label: "Amount Low-High", value: "amount_asc", icon: Hash },
  { label: "Position", value: "position_asc", icon: Hash },
];

const amountRangeOptions = [
  { label: "Under 100", value: "0-99" },
  { label: "100-500", value: "100-500" },
  { label: "500-1000", value: "500-1000" },
  { label: "Over 1000", value: "1000+" },
];

const dateRangeOptions = [
  { label: "Today", value: "today", icon: Calendar },
  { label: "This Week", value: "week", icon: Calendar },
  { label: "This Month", value: "month", icon: Calendar },
  { label: "This Year", value: "year", icon: Calendar },
];

export default function ProductsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [amountFilters, setAmountFilters] = useState<string[]>([]);
  const [dateFilters, setDateFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );
  const [editData, setEditData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: any }>({});

  const [debouncedSearch] = useDebounce(searchInput, 500);
  const isTypingRef = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const { isCreateModalOpen, openCreateModal, closeCreateModal } =
    useProductModal();
  const {
    updateProduct,
    deleteProduct,
    loading: actionLoading,
  } = useProductActions();

  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: debouncedSearch,
      sortBy: sortBy.replace("_desc", "").replace("_asc", ""),
      sortOrder: sortBy.includes("_desc") ? "desc" : "asc",
    };

    if (amountFilters.length > 0) {
      params.amountFilter = amountFilters.join(",");
    }

    if (dateFilters.length > 0) {
      params.dateFilter = dateFilters.join(",");
    }

    return params;
  }, [debouncedSearch, sortBy, amountFilters, dateFilters, currentPage]);

  const { products, loading, error, pagination, fetchProducts, refresh } =
    useProducts(queryParams);

  const handleSearchChange = useCallback((value: string) => {
    isTypingRef.current = true;
    setSearchInput(value);
    setTimeout(() => {
      isTypingRef.current = false;
    }, 100);
  }, []);

  useEffect(() => {
    if (currentPage !== 1 && !isTypingRef.current) {
      setCurrentPage(1);
    }
  }, [debouncedSearch, sortBy, amountFilters, dateFilters]);

  useEffect(() => {
    if (editingProductId && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingProductId]);

  const handleLoadMore = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleProductCreated = useCallback(
    (product: any) => {
      fetchProducts();
    },
    [fetchProducts]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US").format(amount);
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product._id);
    setEditData({
      [product._id]: {
        name: product.name,
        amount: product.amount.toString(),
        comment: product.comment || "",
      },
    });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditData({});
    setErrors({});
  };

  const validateForm = (productId: string) => {
    const data = editData[productId];
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (data.name.trim().length > 100) {
      newErrors.name = "Product name is too long";
    }

    const amount = parseFloat(data.amount);
    if (isNaN(amount)) {
      newErrors.amount = "Valid amount is required";
    } else if (amount < 0) {
      newErrors.amount = "Amount cannot be negative";
    }

    if (data.comment.length > 500) {
      newErrors.comment = "Comment is too long";
    }

    setErrors({ [productId]: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (productId: string) => {
    if (!validateForm(productId)) return;

    try {
      const data = editData[productId];
      const updateData = {
        name: data.name.trim(),
        amount: parseFloat(data.amount),
        comment: data.comment.trim(),
      };

      const updatedProduct = await updateProduct(productId, updateData);
      refresh();
      setEditingProductId(null);
      setEditData({});
      setErrors({});
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      refresh();
      setDeletingProductId(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, productId: string) => {
    if (e.key === "Escape") {
      if (deletingProductId === productId) {
        setDeletingProductId(null);
      } else if (editingProductId === productId) {
        handleCancelEdit();
      }
    } else if (
      e.key === "Enter" &&
      e.ctrlKey &&
      editingProductId === productId
    ) {
      handleSave(productId);
    }
  };

  const updateEditData = (productId: string, field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const hasActiveFilters =
    debouncedSearch || amountFilters.length > 0 || dateFilters.length > 0;
  const showFullPageLoading =
    loading && currentPage === 1 && !debouncedSearch && products.length === 0;

  if (showFullPageLoading) {
    return <Loading.Page message="Loading your products..." />;
  }

  return (
    <>
      <Container.Page title="My Products">
        <Toolbar>
          <Toolbar.Left>
            <Toolbar.Search
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search products..."
            />

            <Toolbar.Filter
              title="Amount"
              options={amountRangeOptions}
              selectedValues={amountFilters}
              onValueChange={setAmountFilters}
              icon={Hash}
            />

            <Toolbar.Filter
              title="Date"
              options={dateRangeOptions}
              selectedValues={dateFilters}
              onValueChange={setDateFilters}
              icon={Calendar}
            />
          </Toolbar.Left>

          <Toolbar.Right>
            <Toolbar.Sort
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
            />

            <Button
              variant="primary"
              size="md"
              icon={<Plus />}
              onClick={openCreateModal}
            >
              Add Product
            </Button>
          </Toolbar.Right>
        </Toolbar>

        {loading && currentPage === 1 && (
          <div className="flex justify-center py-4">
            <Loading.Inline message="Searching..." />
          </div>
        )}

        {error && (
          <Card variant="outlined" padding="md" rounded="lg">
            <Card.Content>
              <Typography.Body>Error loading products: {error}</Typography.Body>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProducts()}
              >
                Try Again
              </Button>
            </Card.Content>
          </Card>
        )}

        {!loading && !error && products.length === 0 && (
          <EmptyState
            icon={hasActiveFilters ? Search : Package}
            title={hasActiveFilters ? "No products found" : "No products yet"}
            description={
              hasActiveFilters
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Get started by adding your first product to begin building your inventory."
            }
            action={
              <Button
                variant="primary"
                size="md"
                icon={<Plus />}
                onClick={openCreateModal}
              >
                {hasActiveFilters ? "Add Product" : "Add Your First Product"}
              </Button>
            }
          />
        )}

        {products.length > 0 && (
          <>
            <Container.ProductGrid>
              {products.map((product: Product) => {
                const isEditing = editingProductId === product._id;
                const isDeleting = deletingProductId === product._id;
                const productEditData = editData[product._id];
                const productErrors = errors[product._id] || {};

                return (
                  <div
                    key={product._id}
                    className="group"
                    onKeyDown={(e) => handleKeyDown(e, product._id)}
                  >
                    <Card
                      variant="product"
                      padding="lg"
                      hover={!isEditing && !isDeleting}
                      isEditing={isEditing}
                      isDeleting={isDeleting}
                    >
                      {!isEditing && !isDeleting && (
                        <Card.Actions>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Edit2 />}
                            onClick={() => handleEdit(product)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Trash2 />}
                            onClick={() => setDeletingProductId(product._id)}
                          />
                        </Card.Actions>
                      )}

                      {isDeleting && (
                        <Card.DeleteOverlay>
                          <Typography.Body>
                            Are you sure you want to delete "{product.name}"?
                          </Typography.Body>
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="danger"
                              size="sm"
                              loading={actionLoading}
                              onClick={() => handleDelete(product._id)}
                              icon={<Trash2 />}
                            >
                              Delete
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingProductId(null)}
                              icon={<X />}
                            >
                              Cancel
                            </Button>
                          </div>
                        </Card.DeleteOverlay>
                      )}

                      <Card.Header>
                        {isEditing ? (
                          <div className="flex-1 mr-4">
                            <Input
                              value={productEditData?.name || ""}
                              onChange={(value) =>
                                updateEditData(product._id, "name", value)
                              }
                              placeholder="Product name"
                              error={productErrors.name}
                            />
                          </div>
                        ) : (
                          <Card.Title>{product.name}</Card.Title>
                        )}

                        {isEditing ? (
                          <div className="w-32">
                            <Input
                              value={productEditData?.amount || ""}
                              onChange={(value) =>
                                updateEditData(product._id, "amount", value)
                              }
                              placeholder="Amount"
                              type="number"
                              error={productErrors.amount}
                            />
                          </div>
                        ) : (
                          <Typography.Amount>
                            $ {formatAmount(product.amount)}
                          </Typography.Amount>
                        )}
                      </Card.Header>

                      <Card.Content>
                        {(product.comment || isEditing) && (
                          <Card.Comment isEditing={isEditing}>
                            {isEditing ? (
                              <Textarea
                                value={productEditData?.comment || ""}
                                onChange={(value) =>
                                  updateEditData(product._id, "comment", value)
                                }
                                placeholder="Add a comment (optional)"
                                rows={2}
                                error={productErrors.comment}
                              />
                            ) : (
                              <Typography.Meta icon={MessageSquare}>
                                {product.comment}
                              </Typography.Meta>
                            )}
                          </Card.Comment>
                        )}

                        <Container.ProductMetaGroup>
                          <Typography.Meta icon={Calendar}>
                            Created {formatDate(product.createdAt)}
                          </Typography.Meta>

                          {product.position !== undefined && (
                            <Typography.Meta icon={Hash}>
                              Position {product.position}
                            </Typography.Meta>
                          )}
                        </Container.ProductMetaGroup>
                      </Card.Content>

                      {isEditing && (
                        <>
                          <Card.Footer>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                              icon={<X />}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              loading={actionLoading}
                              onClick={() => handleSave(product._id)}
                              icon={<Save />}
                            >
                              Save
                            </Button>
                          </Card.Footer>

                          <Card.EditHint>
                            <Typography.Caption>
                              Press Ctrl+Enter to save, Escape to cancel
                            </Typography.Caption>
                          </Card.EditHint>
                        </>
                      )}
                    </Card>
                  </div>
                );
              })}
            </Container.ProductGrid>

            <Container.ProductActions>
              {pagination?.hasNextPage && (
                <Container.ProductLoadMore>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    loading={loading}
                    onClick={handleLoadMore}
                  >
                    {loading
                      ? "Loading..."
                      : `Load More (${
                          pagination.totalCount - products.length
                        } remaining)`}
                  </Button>
                </Container.ProductLoadMore>
              )}

              {pagination && (
                <Container.ProductStats>
                  <Typography.Caption>
                    Showing {products.length} of {pagination.totalCount}{" "}
                    products
                    {loading && currentPage === 1 && " (searching...)"}
                  </Typography.Caption>
                </Container.ProductStats>
              )}
            </Container.ProductActions>
          </>
        )}
      </Container.Page>

      <ProductCreationModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSuccess={handleProductCreated}
      />
    </>
  );
}
