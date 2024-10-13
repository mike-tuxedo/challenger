<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Textarea } from "$lib/components/ui/textarea";
    import {
        Avatar,
        AvatarFallback,
        AvatarImage,
    } from "$lib/components/ui/avatar";
    import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogTrigger,
    } from "$lib/components/ui/alert-dialog";
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from "$lib/components/ui/dialog";
    import { RadioGroup, RadioGroupItem } from "$lib/components/ui/radio-group";
    import { Download, Trash2, Send, Info } from "lucide-svelte";
    import Sun from "lucide-svelte/icons/sun";
    import Moon from "lucide-svelte/icons/moon";

    import { toggleMode } from "mode-watcher";

    let name = $state("John Doe");
    let email = $state("john@example.com");
    let avatarSrc = "/images/user.png";
    let selectedTheme = $state("system");

    const themes = [
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "System" },
        { value: "blue", label: "Blue" },
        { value: "green", label: "Green" },
        { value: "purple", label: "Purple" },
    ];

    function backupChallenges() {
        console.log("Backing up challenges...");
    }

    function deleteAllData() {
        console.log("Deleting all data...");
    }

    function changeTheme(event) {
        selectedTheme = event.detail;
        console.log("Changing theme to:", selectedTheme);
    }

    function sendFeedback() {
        console.log("Sending feedback...");
    }

    function updateProfile() {
        console.log("Updating profile...");
    }
</script>

<div class="container mx-auto p-4 max-w-3xl">
	<Button on:click={toggleMode} variant="outline" size="icon">
		<Sun
		  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
		  class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	  </Button>
	  
    <h1 class="text-3xl font-bold mb-6">User Profile</h1>

    <div class="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="space-y-4">
                    <div class="flex items-center space-x-4">
                        <Avatar class="w-20 h-20">
                            <AvatarImage src={avatarSrc} alt={name} />
                            <AvatarFallback>{name[0]}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">Change Avatar</Button>
                    </div>
                    <div class="grid grid-cols-1 gap-4">
                        <div class="space-y-2">
                            <Label for="name">Name</Label>
                            <Input id="name" bind:value={name} />
                        </div>
                        <div class="space-y-2">
                            <Label for="email">Email</Label>
                            <Input id="email" type="email" bind:value={email} />
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button on:click={updateProfile}>Update Profile</Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>App Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="space-y-4">
                    <Label>Theme</Label>
                    <RadioGroup
                        value={selectedTheme}
                        onValueChange={changeTheme}
                    >
                        {#each themes as theme}
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={theme.value}
                                    id={theme.value}
                                />
                                <Label for={theme.value}>{theme.label}</Label>
                            </div>
                        {/each}
                    </RadioGroup>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
                <Button
                    variant="outline"
                    class="w-full"
                    on:click={backupChallenges}
                >
                    <Download class="mr-2 h-4 w-4" />
                    Backup Challenges
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button variant="destructive" class="w-full">
                            <Trash2 class="mr-2 h-4 w-4" />
                            Delete All Data
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle
                                >Are you absolutely sure?</AlertDialogTitle
                            >
                            <AlertDialogDescription
                                >This action cannot be undone. This will
                                permanently delete all your data including
                                challenges and settings.</AlertDialogDescription
                            >
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction on:click={deleteAllData}
                                >Yes, delete all data</AlertDialogAction
                            >
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Feedback</CardTitle>
                <CardDescription
                    >We'd love to hear your thoughts on the app!</CardDescription
                >
            </CardHeader>
            <CardContent>
                <Textarea placeholder="Type your feedback here..." />
            </CardContent>
            <CardFooter>
                <Button on:click={sendFeedback}>
                    <Send class="mr-2 h-4 w-4" />
                    Send Feedback
                </Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>App Information</CardTitle>
            </CardHeader>
            <CardContent>
                <Dialog>
                    <DialogTrigger>
                        <Button variant="outline">
                            <Info class="mr-2 h-4 w-4" />
                            View Full App Info
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>App Information</DialogTitle>
                            <DialogDescription>
                                <div class="space-y-2 mt-4">
                                    <p>
                                        <strong>Version:</strong>
                                        1.0.0
                                    </p>
                                    <p>
                                        <strong>Developer:</strong>
                                        Challenge App Team
                                    </p>
                                    <p>
                                        <strong>Contact:</strong>
                                        support@challengeapp.com
                                    </p>
                                    <p>
                                        <strong>Description:</strong>
                                        Challenge App is a powerful tool designed
                                        to help users create, manage, and track their
                                        fitness challenges. With features like custom
                                        exercise creation, public challenge sharing,
                                        and progress tracking, it's the perfect companion
                                        for your fitness journey.
                                    </p>
                                    <p>
                                        <strong>Last Updated:</strong>
                                        June 1, 2023
                                    </p>
                                    <p>
                                        <strong>License:</strong>
                                        MIT License
                                    </p>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    </div>
</div>
