import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Controller
        name={name || "content"}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <div className="border border-gray-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-primary transition duration-200">
            <Editor
              apiKey="d7ahgeqhumaexn8ou10d5yz5ejgbhbim2nrom2dsetwebp16"
              value={value}
              onEditorChange={onChange}
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  "advlist", "autolink", "lists", "link", "image",
                  "charmap", "preview", "anchor", "searchreplace",
                  "visualblocks", "code", "fullscreen", "insertdatetime",
                  "media", "table", "help", "wordcount"
                ],
                toolbar:
                  "undo redo | blocks | bold italic forecolor | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | image | removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color:#111 }",
              }}
            />
          </div>
        )}
      />
    </div>
  );
}
