// # List a Pet Form (Multi-Step, Complete)

import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { ArrowRight } from "lucide-react";

import { createPetListing, type CreatePetPayload } from "@/api/petAPI";
import { ImageUploader } from "@/components/pets/ImageUploader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormLabelWithIndicator } from "@/components/ui/form-label-with-indicator";

const petFormSchema = z.object({
  name: z.string().min(2, "Name is required and must be at least 2 characters."),
  species: z.enum(["dog", "cat", "rabbit", "bird", "other"], { required_error: "Please select a species." }),
  description: z.string().min(10, "Description is required and must be at least 10 characters."),
  adoption_fee: z.coerce.number().min(0, "Adoption fee is required."),
  city: z.string().min(2, "City is required."),
  country: z.string().min(2, "Country is required."),
  images: z.array(z.string()).min(1, "At least one image is required."),
  breed: z.string().optional(),
  age: z.coerce.number().positive().optional(),
  gender: z.enum(["male", "female"]).optional(),
  height: z.coerce.number().positive().optional(),
  weight: z.coerce.number().positive().optional(),
  vaccinated: z.boolean().default(false),
  special_needs: z.boolean().default(false),
  state: z.string().optional(),
  status: z.enum(["available", "pending", "adopted"]),
});

type PetFormValues = z.infer<typeof petFormSchema>;

interface ListPetFormProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export const ListPetForm = ({ currentStep, setCurrentStep }: ListPetFormProps) => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      species: undefined,
      description: "",
      adoption_fee: 0,
      city: "",
      country: "",
      images: [],
      breed: "",
      age: undefined,
      gender: undefined,
      height: undefined,
      weight: undefined,
      vaccinated: false,
      special_needs: false,
      state: "",
      status: "available",
    },
    mode: 'onChange',
  });


const petFormSchema = z.object({
  name: z.string().min(2, "Name is required and must be at least 2 characters."),
  species: z.enum(["dog", "cat", "rabbit", "bird", "other"], { required_error: "Please select a species." }),
  description: z.string().min(10, "Description is required and must be at least 10 characters."),
  adoption_fee: z.coerce.number().min(0, "Adoption fee is required."),
  city: z.string().min(2, "City is required."),
  country: z.string().min(2, "Country is required."),
  images: z.array(z.string()).min(1, "At least one image is required."),
  breed: z.string().optional(),
  age: z.coerce.number().positive().optional(),
  gender: z.enum(["male", "female"]).optional(),
  height: z.coerce.number().positive().optional(),
  weight: z.coerce.number().positive().optional(),
  vaccinated: z.boolean().default(false),
  special_needs: z.boolean().default(false),
  state: z.string().optional(),
  status: z.enum(["available", "pending", "adopted"]),
});

type PetFormValues = z.infer<typeof petFormSchema>;

interface ListPetFormProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export const ListPetForm = ({ currentStep, setCurrentStep }: ListPetFormProps) => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      species: undefined,
      description: "",
      adoption_fee: 0,
      city: "",
      country: "",
      images: [],
      breed: "",
      age: undefined,
      gender: undefined,
      height: undefined,
      weight: undefined,
      vaccinated: false,
      special_needs: false,
      state: "",
      status: "available",
    },
    mode: 'onChange',
  });

  const handleImagesUploaded = (urls: string[]) => {
    const newImages = [...images, ...urls];
    setImages(newImages);
    form.setValue('images', newImages, { shouldValidate: true });
  };

  const handleDeleteImage = (imageUrl: string) => {
    const newImages = images.filter((url) => url !== imageUrl);
    setImages(newImages);
    form.setValue('images', newImages, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<PetFormValues> = async (data) => {
    const toastId = toast.loading("Submitting your listing...");
    try {
      const petDataForApi: CreatePetPayload = {
        name: data.name,
        species: data.species,
        description: data.description,
        adoption_fee: data.adoption_fee,
        images: data.images,
        breed: data.breed,
        age: data.age,
        gender: data.gender,
        health_status: {
          vaccinated: data.vaccinated,
          special_needs: data.special_needs,
        },
        size: {
          height: data.height,
          weight: data.weight,
        },
        status: data.status,
        location: {
          city: data.city,
          country: data.country,
          state: data.state,
        },
      };

      const newPet = await createPetListing(petDataForApi);
      toast.success("Pet listed successfully!", { id: toastId });
      navigate(`/pets/${newPet._id}`);
    } catch (error) {
      let errorMessage = "Failed to list pet. Please try again.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage, { id: toastId });
      console.error("Pet listing failed:", error);
    }
  };

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof PetFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['name', 'description', 'images'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['species']; // Only species is truly required in this step
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error("Please fill out all required fields before continuing.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* # Step 1: Pet Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-poppins font-bold text-neutral-800">Pet Information</h2>
            <FormField control={form.control} name="images" render={() => (
              <FormItem>
                <FormLabelWithIndicator required>Images</FormLabelWithIndicator>
                <FormControl>
                  <ImageUploader onImagesUploaded={handleImagesUploaded} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((url) => (
                  <div key={url} className="relative">
                    <img src={url} alt="Pet" className="h-32 w-full rounded-md object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6"
                      onClick={() => handleDeleteImage(url)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabelWithIndicator required>Name</FormLabelWithIndicator>
                <FormControl><Input placeholder="e.g., Buddy" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabelWithIndicator required>Description</FormLabelWithIndicator>
                <FormControl>
                  <Textarea placeholder="Tell us about your pet's personality..." className="min-h-[120px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        )}

        {/* ... (rest of the form remains the same) ... */}

      </form>
    </Form>
  );
};

  const onSubmit: SubmitHandler<PetFormValues> = async (data) => {
    const toastId = toast.loading("Submitting your listing...");
    try {
      const petDataForApi: CreatePetPayload = {
        name: data.name,
        species: data.species,
        description: data.description,
        adoption_fee: data.adoption_fee,
        images: data.images,
        breed: data.breed,
        age: data.age,
        gender: data.gender,
        health_status: {
          vaccinated: data.vaccinated,
          special_needs: data.special_needs,
        },
        size: {
          height: data.height,
          weight: data.weight,
        },
        status: data.status,
        location: {
          city: data.city,
          country: data.country,
          state: data.state,
        },
      };

      const newPet = await createPetListing(petDataForApi);
      toast.success("Pet listed successfully!", { id: toastId });
      navigate(`/pets/${newPet._id}`);
    } catch (error) {
      let errorMessage = "Failed to list pet. Please try again.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage, { id: toastId });
      console.error("Pet listing failed:", error);
    }
  };

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof PetFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['name', 'description', 'images'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['species']; // Only species is truly required in this step
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error("Please fill out all required fields before continuing.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* # Step 1: Pet Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-poppins font-bold text-neutral-800">Pet Information</h2>
            <FormField control={form.control} name="images" render={() => (
              <FormItem>
                <FormLabelWithIndicator required>Images</FormLabelWithIndicator>
                <FormControl>
                  <ImageUploader onImagesUploaded={handleImagesUploaded} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((url) => (
                  <div key={url} className="relative">
                    <img src={url} alt="Pet" className="h-32 w-full rounded-md object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6"
                      onClick={() => handleDeleteImage(url)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabelWithIndicator required>Name</FormLabelWithIndicator>
                <FormControl><Input placeholder="e.g., Buddy" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabelWithIndicator required>Description</FormLabelWithIndicator>
                <FormControl>
                  <Textarea placeholder="Tell us about your pet's personality..." className="min-h-[120px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        )}

        {/* # Step 2: Health & Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-poppins font-bold text-neutral-800">Health & Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField control={form.control} name="species" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator required>Species</FormLabelWithIndicator>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a species" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="rabbit">Rabbit</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="breed" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator>Breed</FormLabelWithIndicator>
                  <FormControl><Input placeholder="e.g., Golden Retriever" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="age" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator>Age</FormLabelWithIndicator>
                  <FormControl><Input type="number" placeholder="e.g., 3" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator>Gender</FormLabelWithIndicator>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="height" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator>Height (cm)</FormLabelWithIndicator>
                  <FormControl><Input type="number" placeholder="e.g., 55" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="weight" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator>Weight (kg)</FormLabelWithIndicator>
                  <FormControl><Input type="number" placeholder="e.g., 25" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="vaccinated" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 col-span-full">
                  <FormLabelWithIndicator>Vaccinated</FormLabelWithIndicator>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="special_needs" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 col-span-full">
                  <FormLabelWithIndicator>Special Needs</FormLabelWithIndicator>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </div>
          </div>
        )}

        {/* # Step 3: Location & Fee */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-poppins font-bold text-neutral-800">Location & Final Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator required>City</FormLabelWithIndicator>
                  <FormControl><Input placeholder="e.g., New York" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="state" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator>State</FormLabelWithIndicator>
                  <FormControl><Input placeholder="e.g., NY" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator required>Country</FormLabelWithIndicator>
                  <FormControl><Input placeholder="e.g., USA" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="adoption_fee" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator required>Adoption Fee ($)</FormLabelWithIndicator>
                  <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                  <FormDescription>Enter 0 for free adoption.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-full">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Listing Active</FormLabel>
                    <FormDescription>Make this listing visible to all adopters.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value === "available"} onCheckedChange={(checked) => field.onChange(checked ? "available" : "pending")} />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </div>
        )}

        {/* # Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
          <div>
            {currentStep > 1 && (
              <Button type="button" variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} className="font-montserrat text-neutral-600">
                Back
              </Button>
            )}
          </div>
          <div>
            {currentStep < 3 && (
              <Button type="button" size="lg" onClick={handleNextStep} className="font-montserrat group">
                Continue <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
            {currentStep === 3 && (
              <Button type="submit" size="lg" className="font-montserrat bg-limegreen hover:bg-limegreen/90">
                Save Listing
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};