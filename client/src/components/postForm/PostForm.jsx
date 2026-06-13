import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createPost, updatePost } from "../../services/postService";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // 🔹 Generate slug from title (not editable)
  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s+/g, "-");
    }
    return "";
  }, []);

  // 🔹 Auto-update slug when title changes
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  // 🔹 Submit handler
  const submit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug); // slug sent to backend but not editable
      formData.append("content", data.content || "");
      formData.append("status", "active");
      if (data.image?.[0]) formData.append("featuredImage", data.image[0]); // optional

      let res;
      if (post) {
        res = await updatePost(post._id, formData);
      } else {
        res = await createPost(formData);
      }

      toast.success(post ? "✅ Post updated!" : "✅ New post created!");
      navigate("/all-posts"); // redirect to /all-posts
    } catch (err) {
      console.error("Post submission error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "❌ Failed to submit post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      {/* Left side - Content */}
      <div className="w-full md:w-2/3 px-2">
        <Input
          label="Title:"
          placeholder="Enter your post title"
          className="mb-4"
          {...register("title", { required: true })}
        />

        {/* Hidden slug field */}
        <input type="hidden" {...register("slug", { required: true })} />

        <RTE
          label="Content:"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      {/* Right side - Image & Status */}
      <div className="w-full md:w-1/3 px-2">
        <Input
          label="Featured Image (Optional):"
          type="file"
          className="mb-4"
          accept="image/*"
          {...register("image", {
            onChange: (e) => {
              if (e.target.files?.[0]) {
                setPreview(URL.createObjectURL(e.target.files[0]));
              }
            }
          })}
        />

        {/* Image Preview */}
        {(preview || post?.featuredImage) && (
          <div className="w-full mb-4">
            <img
              src={preview || post.featuredImage}
              alt="Preview"
              className="rounded-lg shadow-md"
            />
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {loading ? "⏳ Saving..." : post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
