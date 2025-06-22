import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { User, Store } from "lucide-react";


// animation for form elements

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


// form validation schema

export const formSchema = z.object({
        name: z.string().optional(),
        email: z.string().email({message: 'Invalid email address'}),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
        profile_type: z.enum(["adopter", "seller"], 
        {
                required_error: "You must select a profile type.",
        }),

});

export type AuthFormValues = z.infer<typeof formSchema>;
// props for reusable form elements

interface AuthFormProps {
        formtype: 'login' | 'register';
        onSubmit: (values: AuthFormValues) => void;
};



const AuthForm = ({formtype, onSubmit} : AuthFormProps) => {

        const form = useForm<AuthFormValues>(
        {
                resolver: zodResolver(formSchema),
                defaultValues: {
                        name: '',
                        email: '',
                        password: '',
                        profile_type: 'adopter',
                },
        })

        // define what text will show based on form type
        
        const title = (formtype === 'register') ? "Register an Account" : "Welcome Back";
        const description = (formtype === 'register') ? "Enter your details below to create your account." : "Enter your email and password to sign in.";
        const buttonText = (formtype === 'register') ? "Create Account" : "Sign In";
        const footerText = (formtype === 'register') ? "Already have an account?" : "Don't have an account?";
        const footerLink = (formtype === 'register') ? "/login" : "/register";
        const footerLinkText = (formtype === 'register') ? "Sign In" : "Sign Up";


        return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                <Card className="w-200 max-w-sm justify-center ">
                        <CardHeader className="text-center">
                                <CardTitle className="font-poppins " > {title}</CardTitle>
                                <CardDescription className="font-montserrat text-xs"> {description} </CardDescription>
                        </CardHeader>

                        <CardContent>
                                <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                                {formtype === 'register' && (
                                                        <motion.div
                                                                initial="hidden"
                                                                animate="visible"
                                                                variants={formVariants}
                                                                transition={{ delay: 0.1 }}>
                                                                <FormField 
                                                                        control={form.control}
                                                                        name="name"
                                                                        render={({ field }) => (
                                                                                <FormItem>
                                                                                        <FormLabel className="font-poppins text-[10px]">Name</FormLabel>
                                                                                        <FormControl>
                                                                                                <Input {...field} placeholder="Enter your name" />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                </FormItem>
                                                                        )}/>
                                                        </motion.div>
                                                )}
                                                <motion.div variants={formVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                                                        <FormField
                                                                control={form.control}
                                                                name="email"
                                                                render={({ field }) => (
                                                                <FormItem>
                                                                <FormLabel className="font-poppins text-[10px]">Email</FormLabel>
                                                                <FormControl>
                                                                        <Input className="font-montserrat size-xs" type="email" placeholder="you@example.com" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                                </FormItem>
                                                                )}/>
                                                </motion.div>
                                                <motion.div variants={formVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                                                        <FormField
                                                        control={form.control}
                                                        name="password"
                                                        render={({ field }) => (
                                                        <FormItem>
                                                        <FormLabel className="font-poppins text-[10px]">Password</FormLabel>
                                                        <FormControl>
                                                                <Input type="password" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                        </FormItem>)}/>
                                                </motion.div>
                                                                
                                                <motion.div variants={formVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                                                        <FormField
                                                                control={form.control}
                                                                name="profile_type"
                                                                render={({ field }) => (
                                                                <FormItem className="space-y-3 pt-2">
                                                                        <FormLabel className="font-poppins text-[12px] text-center block"> Continue as </FormLabel>
                                                                <FormControl>
                                                                <ToggleGroup
                                                                        type="single"
                                                                        variant="outline"
                                                                        className="grid grid-cols-2 gap-2 ml-22"
                                                                        value={field.value}
                                                                        onValueChange={field.onChange}>
                                                                        
                                                                        {/* Adopter Option */}
                                                                        <ToggleGroupItem value="adopter" className="h-auto flex flex-col gap-2 p-4 data-[state=on]:bg-beige data-[state=on]:text-black">
                                                                        <User className="h-8 w-8" />
                                                                        <span className="text-xs font-montserrat">Adopter</span>
                                                                        </ToggleGroupItem>
                                                                        
                                                                        {/* Seller Option */}
                                                                        <ToggleGroupItem value="seller" className="h-auto flex flex-col gap-2 p-4 data-[state=on]:bg-limegreen data-[state=on]:text-black">
                                                                        <Store className="h-8 w-8" />
                                                                        <span className="text-xs font-medium font-montserrat">Seller</span>
                                                                        </ToggleGroupItem>
                                                                </ToggleGroup>
                                                                </FormControl>
                                                                <FormMessage />
                                                                </FormItem>
                                                                )}
                                                        />
                                                        </motion.div>

                                                <motion.div variants={formVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                                                        <Button type="submit" className="w-full font-poppins">{buttonText}</Button>
                                                </motion.div>
                                        </form>
                                </Form>
                        </CardContent>
                        <CardFooter className="flex justify-center text-xs font-montserrat"> 
                                <p>{footerText} <Link to={footerLink} className="font-semibold text-indigo-600 hover:underline">{footerLinkText}</Link></p> 
                        </CardFooter>
                </Card>
        </motion.div>
        )
}

export default AuthForm
