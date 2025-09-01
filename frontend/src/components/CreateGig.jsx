import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gigSchema } from "@/schemas/gigSchema";
import { useCreateGigMutation } from "@/features/api/gig.api";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrashCan, // Replaces Trash2
  faTimes, // Replaces X for tags
  faTag,
  faImage,
  faDollarSign,
  faClock,
  faBoxOpen, // For packages
  faGift, // For extras
  faQuestionCircle, // For requirements
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
  faHeading, // For title
  faAlignLeft, // For description
  faListAlt, // For category
  faChevronDown // For dropdowns
} from "@fortawesome/free-solid-svg-icons";

const categoryOptions = [
  { value: "web-development", label: "Web Development" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "writing-translation", label: "Writing & Translation" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "video-animation", label: "Video & Animation" },
  { value: "music-audio", label: "Music & Audio" },
  { value: "programming-tech", label: "Programming & Tech" },
  { value: "business", label: "Business" },
  { value: "lifestyle", label: "Lifestyle" },
  // …add more here if needed
];

const packageTypeOptions = [
  { value: "Basic", label: "Basic" },
  { value: "Standard", label: "Standard" },
  { value: "Premium", label: "Premium" },
];

export default function CreateGigForm() {
  const [tagInput, setTagInput] = useState("");
  const [createGig, { isLoading: isCreating }] = useCreateGigMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset, // Added for form reset on success
    formState: { errors },
  } = useForm({
    resolver: zodResolver(gigSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: [],
      price: 0,
      deliveryTime: 1,
      packages: [],
      extras: [],
      requirements: [],
      images: [],
    },
  });

  const {
    fields: packageFields,
    append: appendPackage,
    remove: removePackage,
  } = useFieldArray({
    control,
    name: "packages",
  });

  const {
    fields: extraFields,
    append: appendExtra,
    remove: removeExtra,
  } = useFieldArray({
    control,
    name: "extras",
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "requirements",
  });

  const watchedTags = watch("tags") || [];
  const watchedImages = watch("images") || []; // Watch images for preview

  const handleAddTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue("tags", [...watchedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setValue(
      "tags",
      watchedTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setValue("images", files);
  };

  const addPackage = () => {
    appendPackage({ name: "", price: 0, deliveryTime: 1, features: [] });
  };

  const addExtra = () => {
    appendExtra({ name: "", price: 0, description: "" });
  };

  const addRequirement = () => {
    appendRequirement({ question: "" });
  };

  const onSubmit = async (data) => {
    const submitData = new FormData();

    // Append basic fields
    submitData.append("title", data.title);
    submitData.append("description", data.description);
    submitData.append("category", data.category);
    submitData.append("price", data.price.toString());
    submitData.append("deliveryTime", data.deliveryTime.toString());

    // Append arrays as JSON strings
    if (data.tags && data.tags.length) {
      submitData.append("tags", JSON.stringify(data.tags));
    }
    if (data.packages && data.packages.length) {
      submitData.append("packages", JSON.stringify(data.packages));
    }
    if (data.extras && data.extras.length) {
      submitData.append("extras", JSON.stringify(data.extras));
    }
    if (data.requirements && data.requirements.length) {
      submitData.append("requirements", JSON.stringify(data.requirements));
    }

    // Append images
    if (data.images && data.images.length) {
      data.images.forEach((file) => {
        submitData.append("images", file);
      });
    }

    console.log("Submitting gig data:", data);
    console.log("FormData entries:", Array.from(submitData.entries()));

    const promise = async () => {
      const response = await createGig(submitData).unwrap();
      reset(); // Reset form on success
      return response;
    };

    toast.promise(promise(), {
      loading: "Creating your gig...",
      success: "Gig created successfully! 🎉",
      error: (err) => err?.data?.message || "Failed to create gig. Please try again.",
    });
  };

  // Helper for input styling
  const inputClass = (fieldError) => `
    w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2
    focus:ring-primary focus:border-transparent transition-all duration-200
    ${fieldError ? "border-red-500" : "border-gray-300"}
    bg-white/80 text-gray-800 placeholder-gray-500
  `;

  const labelClass = "block text-sm font-medium text-gray-700 mb-2";
  const errorClass = "mt-1 text-sm text-red-600 flex items-center gap-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-200 bg-gradient-to-r from-primary to-primary-light text-white">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-center">
            Create Your New Gig
          </h2>
          <p className="text-center text-lg mt-2 opacity-90">
            Showcase your skills and services to the world.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-10">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faBoxOpen} className="text-primary" /> Basic Information
            </h3>

            <div>
              <label htmlFor="title" className={labelClass}>
                Gig Title
              </label>
              <div className="relative">
                <input
                  id="title"
                  {...register("title")}
                  type="text"
                  placeholder="I will create a stunning logo design..."
                  className={inputClass(errors.title)}
                />
                <FontAwesomeIcon icon={faHeading} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.title && (
                <p className={errorClass}>
                  <FontAwesomeIcon icon={faExclamationCircle} /> {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe your service in detail..."
                  rows={6}
                  className={inputClass(errors.description)}
                />
                <FontAwesomeIcon icon={faAlignLeft} className="absolute right-4 top-4 text-gray-400" />
              </div>
              {errors.description && (
                <p className={errorClass}>
                  <FontAwesomeIcon icon={faExclamationCircle} /> {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  {...register("category")}
                  className={inputClass(errors.category) + " appearance-none pr-10"} // Added appearance-none and pr-10
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FontAwesomeIcon icon={faListAlt} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.category && (
                <p className={errorClass}>
                  <FontAwesomeIcon icon={faExclamationCircle} /> {errors.category.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className={labelClass}>
                  Starting Price ($)
                </label>
                <div className="relative">
                  <input
                    id="price"
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 25.00"
                    className={inputClass(errors.price) + " pl-10"}
                  />
                  <FontAwesomeIcon icon={faDollarSign} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.price && (
                  <p className={errorClass}>
                    <FontAwesomeIcon icon={faExclamationCircle} /> {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="deliveryTime" className={labelClass}>
                  Delivery Time (days)
                </label>
                <div className="relative">
                  <input
                    id="deliveryTime"
                    {...register("deliveryTime", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    placeholder="e.g., 3"
                    className={inputClass(errors.deliveryTime) + " pl-10"}
                  />
                  <FontAwesomeIcon icon={faClock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.deliveryTime && (
                  <p className={errorClass}>
                    <FontAwesomeIcon icon={faExclamationCircle} /> {errors.deliveryTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tagInput" className={labelClass}>
                Tags (keywords)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  id="tagInput"
                  type="text"
                  placeholder="Add a tag and press Enter or click Add..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/80"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-5 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-200 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full border border-gray-200 shadow-sm"
                  >
                    <FontAwesomeIcon icon={faTag} className="text-gray-500" />
                    {tag}
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="w-3 h-3 cursor-pointer text-gray-500 hover:text-red-500 transition-colors"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </span>
                ))}
              </div>
              {errors.tags && (
                <p className={errorClass}>
                  <FontAwesomeIcon icon={faExclamationCircle} /> {errors.tags.message}
                </p>
              )}
            </div>

            {/* Images */}
            <div>
              <label htmlFor="images" className={labelClass}>
                Gig Images (Max 5)
              </label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0
                         file:text-sm file:font-semibold file:bg-primary-light file:text-white
                         hover:file:bg-primary transition-colors duration-200 cursor-pointer"
              />
              {errors.images && (
                <p className={errorClass}>
                  <FontAwesomeIcon icon={faExclamationCircle} /> {errors.images.message}
                </p>
              )}
              {watchedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {watchedImages.map((file, index) => (
                    <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Gig image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = watchedImages.filter((_, i) => i !== index);
                          setValue("images", newImages);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        aria-label="Remove image"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Packages */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon icon={faBoxOpen} className="text-primary" /> Packages
              </h3>
              <button
                type="button"
                onClick={addPackage}
                className="px-5 py-2 bg-secondary text-white rounded-lg shadow-md hover:bg-secondary-dark transition-colors duration-200 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4" /> Add Package
              </button>
            </div>

            {packageFields.length === 0 && (
              <p className="text-gray-500 text-center py-4">Add at least one package to your gig.</p>
            )}

            <div className="space-y-6">
              {packageFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-800 text-lg">
                      Package {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removePackage(index)}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                      aria-label="Remove package"
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Package Name
                      </label>
                      <div className="relative">
                        <select
                          {...register(`packages.${index}.name`)}
                          className={inputClass(errors.packages?.[index]?.name) + " appearance-none pr-10"}
                        >
                          <option value="">Select type</option>
                          {packageTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <FontAwesomeIcon icon={faChevronDown} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                      {errors.packages?.[index]?.name && (
                        <p className={errorClass}>
                          <FontAwesomeIcon icon={faExclamationCircle} /> {errors.packages[index].name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <div className="relative">
                        <input
                          {...register(`packages.${index}.price`, {
                            valueAsNumber: true,
                          })}
                          type="number"
                          min="0"
                          step="0.01"
                          className={inputClass(errors.packages?.[index]?.price) + " pl-10"}
                        />
                        <FontAwesomeIcon icon={faDollarSign} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                      {errors.packages?.[index]?.price && (
                        <p className={errorClass}>
                          <FontAwesomeIcon icon={faExclamationCircle} /> {errors.packages[index].price.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery (days)
                      </label>
                      <div className="relative">
                        <input
                          {...register(`packages.${index}.deliveryTime`, {
                            valueAsNumber: true,
                          })}
                          type="number"
                          min="1"
                          className={inputClass(errors.packages?.[index]?.deliveryTime) + " pl-10"}
                        />
                        <FontAwesomeIcon icon={faClock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                      {errors.packages?.[index]?.deliveryTime && (
                        <p className={errorClass}>
                          <FontAwesomeIcon icon={faExclamationCircle} /> {errors.packages[index].deliveryTime.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* You might add features for packages here if needed */}
                </div>
              ))}
            </div>
          </div>

          {/* Extras */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon icon={faGift} className="text-primary" /> Extras
              </h3>
              <button
                type="button"
                onClick={addExtra}
                className="px-5 py-2 bg-secondary text-white rounded-lg shadow-md hover:bg-secondary-dark transition-colors duration-200 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4" /> Add Extra
              </button>
            </div>

            {extraFields.length === 0 && (
              <p className="text-gray-500 text-center py-4">Offer additional services to your buyers.</p>
            )}

            <div className="space-y-6">
              {extraFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-800 text-lg">
                      Extra {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeExtra(index)}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                      aria-label="Remove extra"
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Extra Name
                      </label>
                      <input
                        {...register(`extras.${index}.name`)}
                        type="text"
                        placeholder="e.g., Express Delivery"
                        className={inputClass(errors.extras?.[index]?.name)}
                      />
                      {errors.extras?.[index]?.name && (
                        <p className={errorClass}>
                          <FontAwesomeIcon icon={faExclamationCircle} /> {errors.extras[index].name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <div className="relative">
                        <input
                          {...register(`extras.${index}.price`, {
                            valueAsNumber: true,
                          })}
                          type="number"
                          min="0"
                          step="0.01"
                          className={inputClass(errors.extras?.[index]?.price) + " pl-10"}
                        />
                        <FontAwesomeIcon icon={faDollarSign} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                      {errors.extras?.[index]?.price && (
                        <p className={errorClass}>
                          <FontAwesomeIcon icon={faExclamationCircle} /> {errors.extras[index].price.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register(`extras.${index}.description`)}
                      placeholder="Describe this extra service..."
                      rows={3}
                      className={inputClass(errors.extras?.[index]?.description)}
                    />
                    {errors.extras?.[index]?.description && (
                        <p className={errorClass}>
                          <FontAwesomeIcon icon={faExclamationCircle} /> {errors.extras[index].description.message}
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon icon={faQuestionCircle} className="text-primary" /> Requirements
              </h3>
              <button
                type="button"
                onClick={addRequirement}
                className="px-5 py-2 bg-secondary text-white rounded-lg shadow-md hover:bg-secondary-dark transition-colors duration-200 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4" /> Add Requirement
              </button>
            </div>

            {requirementFields.length === 0 && (
              <p className="text-gray-500 text-center py-4">Specify what you need from the buyer to start the gig.</p>
            )}

            <div className="space-y-6">
              {requirementFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-800 text-lg">
                      Requirement {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                      aria-label="Remove requirement"
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <input
                      {...register(`requirements.${index}.question`)}
                      type="text"
                      placeholder="e.g., What is your brand name and color palette?"
                      className={inputClass(errors.requirements?.[index]?.question)}
                    />
                    {errors.requirements?.[index]?.question && (
                        <p className={errorClass}>
                          <FontAwesomeIcon icon={faExclamationCircle} /> {errors.requirements[index].question.message}
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-4 px-6 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-lg shadow-lg
                       hover:from-primary-dark hover:to-primary transition-all duration-300
                       flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed
                       transform hover:scale-[1.01] disabled:transform-none"
          >
            {isCreating ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
                Creating Gig...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" />
                Create Gig
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}