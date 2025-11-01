
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  status: z.enum(["open", "pending", "closed", "archived"], {
    required_error: "Please select a case status.",
  }),
  policeStationId: z.coerce.number({
    required_error: "Please enter a police station ID.",
  }),
});

const AddCase = () => {
  const navigate = useNavigate();
  
  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "open",
      policeStationId: 1,
    },
  });

  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Get current cases from localStorage
    const stored = localStorage.getItem('cases');
    let cases = [];
    if (stored) {
      try {
        cases = JSON.parse(stored);
      } catch {
        cases = [];
      }
    }
    // Create new case object
    const newCase = {
      id: Date.now(),
      title: values.title,
      description: values.description,
      status: values.status,
      policeStationId: values.policeStationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Add to cases and save
    const updated = [...cases, newCase];
    localStorage.setItem('cases', JSON.stringify(updated));
    toast.success("Case added successfully!");
    navigate("/cases");
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Case</h1>
        <p className="text-muted-foreground">Create a new FBI case file in the system.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Armed Robbery - Downtown Bank" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a clear and concise title for the case.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of the case..."
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include key details about the case.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The current status of the case.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="policeStationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Police Station ID</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        The ID of the associated police station.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={() => navigate("/cases")}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Case
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCase;
