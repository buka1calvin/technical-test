import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDebounce } from "use-debounce";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';

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
  Move,
  ChevronLeft,
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
import DragHint from "@/src/layout/drag-hint.layout";
import { useProducts, useProductActions } from "@/src/hooks/products.hook";
import { useProductModal } from "@/src/hooks/product-modal.hook";
import { Product } from "@/src/types/types";
import { formatDate } from "@/src/utils/format-date.utils";
import { amountRangeOptions, dateRangeOptions, sortOptions } from "@/constants";
import { formatAmount } from "@/src/utils/currency-formatter.utils";

const ITEMS_PER_PAGE = 9;

export default function ProductsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("position_asc");
  const [amountFilters, setAmountFilters] = useState<string[]>([]);
  const [dateFilters, setDateFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  const [debouncedSearch] = useDebounce(searchInput, 500);
  const isTypingRef = useRef(false);

  const { isCreateModalOpen, openCreateModal, closeCreateModal } = useProductModal();
  const {
    updateProduct,
    deleteProduct,
    reorderProducts,
    loading: actionLoading,
  } = useProductActions();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const queryParams = useMemo(() => {
    const params: any = {
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
  }, [debouncedSearch, sortBy, amountFilters, dateFilters]);

  const { 
    products, 
    loading, 
    error, 
    pagination, 
    fetchProducts, 
    refresh, 
    loadMore, 
    showPrevious,
    canShowPrevious 
  } = useProducts(queryParams);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const handleSearchChange = useCallback((value: string) => {
    isTypingRef.current = true;
    setSearchInput(value);
    setTimeout(() => {
      isTypingRef.current = false;
    }, 100);
  }, []);

  // Reset when filters change (but not during typing)
  useEffect(() => {
    if (currentPage !== 1 && !isTypingRef.current) {
      setCurrentPage(1);
    }
  }, [debouncedSearch, sortBy, amountFilters, dateFilters]);

  const handleLoadMore = () => {
    if (pagination?.hasNextPage && loadMore) {
      loadMore();
    }
  };

  const handleShowPrevious = () => {
    if (canShowPrevious && showPrevious) {
      showPrevious();
    }
  };

  const handleProductCreated = useCallback(
    (product: any) => {
      fetchProducts();
    },
    [fetchProducts]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeProductItem = localProducts.find(p => p._id === active.id);
    
    if (activeProductItem) {
      setActiveProduct(activeProductItem);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveProduct(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = localProducts.findIndex(p => p._id === active.id);
    const newIndex = localProducts.findIndex(p => p._id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newProducts = arrayMove(localProducts, oldIndex, newIndex);
      setLocalProducts(newProducts);

      try {
        const productIds = newProducts.map(product => product._id);
        await reorderProducts(productIds);
        refresh();
      } catch (error) {
        console.error("Failed to reorder products:", error);
        setLocalProducts(localProducts);
      }
    }
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

      await updateProduct(productId, updateData);
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
    } else if (e.key === "Enter" && e.ctrlKey && editingProductId === productId) {
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

  // Fixed drag condition - should work regardless of pagination state
  const isDragEnabled = useMemo(() => {
    return (
      !debouncedSearch &&
      amountFilters.length === 0 &&
      dateFilters.length === 0 &&
      (sortBy === "position_asc" || sortBy === "createdAt_desc") &&
      !editingProductId &&
      !deletingProductId
    );
  }, [debouncedSearch, amountFilters, dateFilters, sortBy, editingProductId, deletingProductId]);

  const renderProductCard = (product: Product, isDragOverlay = false) => {
    const isEditing = editingProductId === product._id;
    const isDeleting = deletingProductId === product._id;
    const productEditData = editData[product._id];
    const productErrors = errors[product._id] || {};

    return (
      <Container.ProductCard
        key={product._id}
        onKeyDown={isDragOverlay ? undefined : (e) => handleKeyDown(e, product._id)}
      >
        <Card
          variant="product"
          padding="lg"
          hover={!isEditing && !isDeleting && !isDragOverlay}
          isEditing={isEditing}
          isDeleting={isDeleting}
          isDraggable={isDragEnabled && !isDragOverlay}
          dragId={product._id}
        >
          {!isEditing && !isDeleting && !isDragOverlay && (
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

          {isDeleting && !isDragOverlay && (
            <Card.DeleteOverlay>
              <Typography.Body>
                Are you sure you want to delete "{product.name}"?
              </Typography.Body>
              <Container.ActionGroup>
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
              </Container.ActionGroup>
            </Card.DeleteOverlay>
          )}

          <Card.Header>
            {isEditing && !isDragOverlay ? (
              <Container.EditField>
                <Input
                  value={productEditData?.name || ""}
                  onChange={(value) => updateEditData(product._id, "name", value)}
                  placeholder="Product name"
                  error={productErrors.name}
                />
              </Container.EditField>
            ) : (
              <Card.Title>{product.name}</Card.Title>
            )}

            {isEditing && !isDragOverlay ? (
              <Container.AmountField>
                <Input
                  value={productEditData?.amount || ""}
                  onChange={(value) => updateEditData(product._id, "amount", value)}
                  placeholder="Amount"
                  type="number"
                  error={productErrors.amount}
                />
              </Container.AmountField>
            ) : (
              <Typography.Amount>$ {formatAmount(product.amount)}</Typography.Amount>
            )}
          </Card.Header>

          <Card.Content>
            {(product.comment || isEditing) && (
              <Card.Comment isEditing={isEditing && !isDragOverlay}>
                {isEditing && !isDragOverlay ? (
                  <Textarea
                    value={productEditData?.comment || ""}
                    onChange={(value) => updateEditData(product._id, "comment", value)}
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

          {isEditing && !isDragOverlay && (
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
            </>
          )}
        </Card>
      </Container.ProductCard>
    );
  };

  const hasActiveFilters = debouncedSearch || amountFilters.length > 0 || dateFilters.length > 0;
  const showFullPageLoading = loading && currentPage === 1 && !debouncedSearch && localProducts.length === 0;

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

        {isDragEnabled && localProducts.length > 1 && (
          <DragHint icon={Move}>
            Drag and drop to reorder your products
          </DragHint>
        )}

        {loading && currentPage === 1 && (
          <Container.LoadingCenter>
            <Loading.Inline message="Searching..." />
          </Container.LoadingCenter>
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

        {!loading && !error && localProducts.length === 0 && (
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

        {localProducts.length > 0 && (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToWindowEdges]}
            >
              <SortableContext
                items={localProducts.map(p => p._id)}
                strategy={rectSortingStrategy}
              >
                <Container.ProductGrid>
                  {localProducts.map((product) => renderProductCard(product))}
                </Container.ProductGrid>
              </SortableContext>

              <DragOverlay>
                {activeProduct ? renderProductCard(activeProduct, true) : null}
              </DragOverlay>
            </DndContext>

            <Container.ProductActions>
              {canShowPrevious && (
                <Container.ProductLoadMore>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={handleShowPrevious}
                    icon={<ChevronLeft />}
                  >
                    Show Previous Items
                  </Button>
                </Container.ProductLoadMore>
              )}

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
                      : `Load More (${pagination.totalCount - localProducts.length} remaining)`}
                  </Button>
                </Container.ProductLoadMore>
              )}

              {pagination && (
                <Container.ProductStats>
                  <Typography.Caption>
                    Showing {localProducts.length} of {pagination.totalCount} products
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