import type { IUser } from "@/features/auth/auth.types";
import { Button, Space, Table, Tag, type TableProps } from "antd";
import { Avatar } from "antd";
import {
  useDeleteUserApiMutation,
  useGetUserApiQuery,
} from "@/features/admin/adminApi";
import DeleteConfirmModal from "@/components/ui/delete-blog-modal";
import { useEffect, useState } from "react";
import EditModal from "@/components/ui/edit-user-modal";
import { Delete, Edit } from "lucide-react";
import { Input } from "antd";
import { useDebounce } from "@/hooks/use-debounce";
function AdminUserPage() {
  const [deleteModal, setDeleteModal] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);

  console.log("Debaounced value: ", debouncedValue);
  const { data: allUsersApiData } = useGetUserApiQuery({
    cursor,
    search: debouncedValue,
  });
  const [users, setUsers] = useState<IUser[] | []>([]);
  const [deleteUserApi, { isLoading }] = useDeleteUserApiMutation();
  const [blogId, setBlogId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  console.log(cursor);

  useEffect(() => {
    if (allUsersApiData?.data.users) {
      if (cursor == null) {
        setUsers(allUsersApiData.data.users);
      } else {
        setUsers((prev) => [...prev, ...allUsersApiData.data.users]);
      }
    }
  }, [allUsersApiData]);
  useEffect(() => {
    setCursor(null);
  }, [debouncedValue]);
  type UserTableType = {
    _id: string;
    avatar?: string;
    username: string;
    role: "user" | "admin";
    createdAt: string;
  };
  const handleDelete = (id: string) => {
    setBlogId(id);
    setDeleteModal(true);
  };

  const dataSource: UserTableType[] =
    users.map((user: IUser) => ({
      _id: user._id,
      key: user._id,
      avatar: user.avatar?.url,
      username: user.username,
      role: user.role,
      createdAt: new Date(user.createdAt).toLocaleString(),
    })) || [];
  const columns: TableProps<UserTableType>["columns"] = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (_, record) => (
        <Avatar src={record.avatar}>
          {record.username?.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: "User name",
      dataIndex: "username",
      key: "name",
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) =>
        role === "admin" ? (
          <Tag color="red">{role}</Tag>
        ) : (
          <Tag color="blue">{role}</Tag>
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "age",
    },
    {
      title: "Action",
      dataIndex: "createdAt",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setSelectedUserId(record._id);
              setIsModalOpen(true);
            }}
          >
            <Edit className="w-5 h-5" />
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            <Delete className="h-5 w-5" />
          </Button>
        </Space>
      ),
    },
  ];
  const handleConfirmDelete = async () => {
    const res = await deleteUserApi({ _id: blogId }).unwrap();
    return res;
  };
  return (
    <div className="overflow-x-auto">
      <div className="flex!">

      <Input
        placeholder="Search User"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        className=""
        />
        </div>
      <Table dataSource={dataSource} scroll={{ x: 800 }} columns={columns} pagination={{pageSize:4}}/>
      <div className={`${search == "" ? "" : "hidden"} `}>

  <Button
  style={{ marginBottom: "40px" }}
  onClick={() => {
      if (allUsersApiData?.data.nextCursor) {
        setCursor(allUsersApiData.data.nextCursor);
      }
    }}
    
    >
    Load more
  </Button>
    </div>
      <DeleteConfirmModal
        isModalOpen={deleteModal}
        setIsModalOpen={setDeleteModal}
        isLoading={isLoading}
        descriptionText="Are you sure you want to delete this user"
        onConfirmMessage="Successfully delete user"
        onConfirm={handleConfirmDelete}
      />

      <EditModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        userId={selectedUserId}
      />
    </div>
  );
}

export default AdminUserPage;
