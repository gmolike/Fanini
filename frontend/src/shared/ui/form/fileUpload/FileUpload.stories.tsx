// frontend/src/form/fileUpload/FileUpload.stories.tsx

/* eslint-disable no-console */

import { FileText, Image, Paperclip, Upload } from 'lucide-react';

import { Form, FormFileUpload, FormFooter, FormHeader, useForm } from '../index';

import type { Meta } from '@storybook/react';

const meta = {
  title: 'form/FileUpload',
  component: FormFileUpload,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Drag and drop file upload with preview',
      },
    },
  },
} satisfies Meta<typeof FormFileUpload>;

export default meta;

/**
 * Basic file upload
 */
export const Basic = () => {
  const form = useForm({
    defaultValues: {
      file: [],
      document: [],
    },
  });

  const handleSubmit = (data: typeof form.formState.defaultValues) => {
    console.log('FileUpload values:', data);
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormHeader
        title="Basic File Upload"
        description="Upload files with drag and drop"
        icon={Upload}
      />

      <div className="space-y-6">
        <FormFileUpload
          control={form.control}
          name="file"
          label="Upload File"
          placeholder="Drop file here or click to browse"
        />

        <FormFileUpload
          control={form.control}
          name="document"
          label="Document"
          placeholder="Select or drop your document"
          description="PDF, DOC, or TXT files accepted"
          accept=".pdf,.doc,.docx,.txt"
        />
      </div>

      <FormFooter showReset submitText="Upload Files" />
    </Form>
  );
};

/**
 * Image upload with preview
 */
export const ImageUpload = () => {
  const form = useForm({
    defaultValues: {
      avatar: [],
      gallery: [],
      banner: [],
    },
  });

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader title="Image Upload" description="Upload images with preview" icon={Image} />

      <div className="space-y-6">
        <FormFileUpload
          control={form.control}
          name="avatar"
          label="Profile Picture"
          accept="image/*"
          maxSize={5 * 1024 * 1024}
          placeholder="Drop your profile picture here"
          description="PNG, JPG up to 5MB"
          showPreview
        />

        <FormFileUpload
          control={form.control}
          name="gallery"
          label="Photo Gallery"
          accept="image/*"
          multiple
          maxFiles={10}
          maxSize={10 * 1024 * 1024}
          placeholder="Drop up to 10 images"
          description="Upload multiple images for your gallery"
          showPreview
        />

        <FormFileUpload
          control={form.control}
          name="banner"
          label="Banner Image"
          accept="image/png,image/jpeg"
          maxSize={2 * 1024 * 1024}
          placeholder="Recommended: 1200x300px"
          description="PNG or JPG, max 2MB"
          showPreview
          showSize
        />
      </div>

      <FormFooter showReset />
    </Form>
  );
};

/**
 * Multiple file types
 */
export const MultipleTypes = () => {
  const form = useForm({
    defaultValues: {
      documents: [],
      spreadsheets: [],
      presentations: [],
      archives: [],
    },
  });

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Multiple File Types"
        description="Different file type restrictions"
        icon={FileText}
      />

      <div className="space-y-6">
        <FormFileUpload
          control={form.control}
          name="documents"
          label="Documents"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          maxFiles={5}
          placeholder="PDF, Word, or Text files"
          showSize
        />

        <FormFileUpload
          control={form.control}
          name="spreadsheets"
          label="Spreadsheets"
          accept=".xlsx,.xls,.csv"
          multiple
          maxFiles={3}
          placeholder="Excel or CSV files"
          description="For data import"
        />

        <FormFileUpload
          control={form.control}
          name="presentations"
          label="Presentations"
          accept=".ppt,.pptx,.pdf"
          placeholder="PowerPoint or PDF"
          maxSize={50 * 1024 * 1024}
          description="Max 50MB per file"
        />

        <FormFileUpload
          control={form.control}
          name="archives"
          label="Archives"
          accept=".zip,.rar,.7z,.tar,.gz"
          placeholder="Compressed files only"
          showSize
        />
      </div>

      <FormFooter />
    </Form>
  );
};

/**
 * File validation example
 */
export const WithValidation = () => {
  const form = useForm({
    defaultValues: {
      resume: [],
      portfolio: [],
      certificates: [],
    },
  });

  const resumeFiles = form.watch('resume');
  const portfolioFiles = form.watch('portfolio');

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Job Application"
        description="Upload your application documents"
        icon={Paperclip}
      />

      <div className="space-y-6">
        <FormFileUpload
          control={form.control}
          name="resume"
          label="Resume/CV"
          accept=".pdf,.doc,.docx"
          maxSize={2 * 1024 * 1024}
          placeholder="Drop your resume (required)"
          description="PDF or Word format, max 2MB"
          required
        />

        {resumeFiles.length > 0 && (
          <div className="rounded-lg bg-green-50 p-3 text-sm dark:bg-green-950">
            ✓ Resume uploaded successfully
          </div>
        )}

        <FormFileUpload
          control={form.control}
          name="portfolio"
          label="Portfolio (Optional)"
          accept=".pdf,.zip,image/*"
          multiple
          maxFiles={5}
          maxSize={10 * 1024 * 1024}
          placeholder="Drop portfolio files"
          description="PDF, images, or ZIP archive"
          showPreview
        />

        {portfolioFiles.length > 0 && (
          <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950">
            {portfolioFiles.length} portfolio {portfolioFiles.length === 1 ? 'file' : 'files'} added
          </div>
        )}

        <FormFileUpload
          control={form.control}
          name="certificates"
          label="Certificates (Optional)"
          accept=".pdf,image/*"
          multiple
          maxFiles={10}
          placeholder="Drop certificates or diplomas"
          showSize
        />
      </div>

      <FormFooter showReset submitText="Submit Application" />
    </Form>
  );
};
