<script>
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Dumbbell, Heart, Calendar } from "lucide-svelte";
    import { appstate } from "$lib/store.js";

    import ChallengeEditorSport from "./sport-editor.svelte";
    import ChallengeEditorHabit from "./habit-editor.svelte";
    import ChallengeEditorOntime from "./ontime-editor.svelte";

    let selectedType = $state(null);

    if ($appstate.editingChallenge) {
        selectedType = $appstate.editingChallenge.type;
    }

    function createNewChallenge(type) {
        selectedType = type;
        $appstate.editingChallenge = null;
    }
</script>


{#if !selectedType}
    <h1 class="text-3xl font-bold w-full max-w-3xl mx-auto mb-6 text-center">Choose a Challengetype</h1>
    <Card class="w-full max-w-3xl mx-auto">
        <CardHeader>
            <CardTitle>Select the type of challenge you want to create</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                    variant={selectedType === "sport" ? "default" : "outline"}
                    class="h-32 flex flex-col items-center justify-center"
                    on:click={() => createNewChallenge("sport")}
                >
                    <Dumbbell class="h-8 w-8 mb-2" />
                    <span>Sport Challenge</span>
                </Button>
                <Button
                    variant={selectedType === "habit" ? "default" : "outline"}
                    class="h-32 flex flex-col items-center justify-center"
                    on:click={() => createNewChallenge("habit")}
                >
                    <Heart class="h-8 w-8 mb-2" />
                    <span>Habit Challenge</span>
                </Button>
                <Button
                    variant={selectedType === "onetime" ? "default" : "outline"}
                    class="h-32 flex flex-col items-center justify-center"
                    on:click={() => createNewChallenge("onetime")}
                >
                    <Calendar class="h-8 w-8 mb-2" />
                    <span>One-time Challenge</span>
                </Button>
            </div>
        </CardContent>
    </Card>
{:else if selectedType == "sport"}
    <ChallengeEditorSport bind:selectedType />
{:else if selectedType == "habit"}
    <ChallengeEditorHabit bind:selectedType />
{:else if selectedType == "onetime"}
    <ChallengeEditorOntime bind:selectedType />
{/if}
