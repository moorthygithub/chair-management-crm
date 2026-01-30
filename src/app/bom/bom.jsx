"use client";

import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import ToggleStatus from "@/components/toogle/status-toogle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BOM_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import BomDialog from "./create-bom";

const BomList = () => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: BOM_API.list,
    queryKey: ["bom-list"],
  });

  const { trigger: deleteBom, loading: deleting } = useApiMutation();
  const handleCreate = () => {
    setEditId(null);
    setOpen(true);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setOpen(true);
  };
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await deleteBom({
        url: BOM_API.deleteById(deleteId),
        method: "delete",
      });

      if (res?.code === 201) {
        toast.success(res?.message || "BOM deleted successfully");
        refetch();
      } else {
        toast.error(res?.message || "Failed to delete BOM");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to delete BOM");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    { header: "Code", accessorKey: "product_code" },
    { header: "Name", accessorKey: "product_name", enableSorting: false },
    {
      header: "Category",
      accessorKey: "product_category",
      enableSorting: false,
    },
    { header: "Rate", accessorKey: "product_rate", enableSorting: false },
    { header: "Quantity", accessorKey: "total_sub_qnty", enableSorting: false },
    {
      header: "Status",
      accessorKey: "bom_status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.bom_status}
          apiUrl={BOM_API.updateStatus(row.original.id)}
          payloadKey="product_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleEdit(row.original.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => handleDeleteClick(row.original.id)}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  if (isLoading) return <LoadingBar />;
  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      <DataTable
        data={data?.data?.data || []}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search BOM..."
        addButton={{
          onClick: handleCreate,
          label: "Add BOM",
        }}
      />

      <BomDialog open={open} onClose={() => setOpen(false)} bomId={editId} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Delete Bom
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bom? This action cannot be
              undone."
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BomList;
