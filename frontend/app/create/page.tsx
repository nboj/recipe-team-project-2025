"use client";
import { stackClientApp } from "@/stack/client";
import { Button, Input, NumberInput, Textarea } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Step = {
  id: string;
  step_no: number;
  instruction_text: string;
  est_minutes: string;
  minutes: number;
  hours: number;
};

export default function CreateRecipePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const router = useRouter()
  const totalDuration = useMemo(() => {
    const [hours, minutes] = steps.reduce(([hours, minutes], current) => [hours + current.hours, minutes + current.minutes], [0, 0])
    return minutes + hours*60
  }, [steps])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    data.set("steps", JSON.stringify(steps.map(s => ({...s, est_minutes: `${s.hours.toString().padStart(2, '0')}:${s.minutes.toString().padStart(2, '0')}`}))))
    data.set(
      "cook_time",
      `${Math.floor((totalDuration/60))?.toString().padStart(2, "0")}:${(totalDuration%60)?.toString().padStart(2, "0")}:00`,
    );

    if (imageFile) data.append("image", imageFile);
    const user = await stackClientApp.getUser();
    if (!user) {
      setMessage("Unauthenticated. Please sign back in.");
      return;
    }

    const { accessToken } = await user.getAuthJson();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/recipes/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      });

      if (res.ok) {
        setMessage(`✅ Created recipe`);
        router.push(`/recipes/${(await res.json()).id}`)
      } else {
        const err = await res.json();
        console.error(err);
        setMessage(`❌ Error creating recipe, try again.`);
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Network error");
    }
  };

  const handleAddStep = () => {
    setSteps((old: Step[]) => {
      console.log(old);
      return [
        ...old,
        {
          id: crypto.randomUUID(),
          est_minutes: "00:00:00",
          instruction_text: "Unspecified",
          step_no: old.length + 1,
          minutes: 0,
          hours: 0,
        },
      ];
    });
  };

  const handleRemoveStep = (target_index: number) => {
    setSteps((old: Step[]) => {
      const filtered = [...old].filter(
        (_item: Step, index: number) => index != target_index,
      );
      const mapped = filtered.map((item: Step, index: number) => ({
        ...item,
        step_no: index + 1,
      }));
      return mapped.sort((a, b) =>
        a.step_no > b.step_no ? 1 : a.step_no == b.step_no ? 0 : -1,
      );
    });
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Recipe</h1>
      <form
        onSubmit={handleSubmit}
        className="grid gap-4"
        encType="multipart/form-data"
      >
        <Input
          name="title"
          type="text"
          label="Title"
          labelPlacement="outside"
          placeholder="The title for your recipe"
        />
        <Textarea
          name="description"
          label="Description"
          labelPlacement="outside"
          placeholder="Tell us about your recipe..."
        />
        <div>
          <p className="text-md font-bold mt-5">Steps</p>
          <div className="flex flex-col gap-[2rem]">
            {steps.map((step: Step, index: number) => {
              return (
                <div key={`step-${step.id}`} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Step {step.step_no}</p>
                    <Button
                      color="danger"
                      size="sm"
                      type="button"
                      onPress={() => handleRemoveStep(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  <Textarea
                    label={`Step ${index + 1} description`}
                    name={`instruction_text_${step.step_no}`}
                    onChange={(e) => setSteps(old => old.map(s => s.id == step.id ? {...s, instruction_text: e.target.value}: s))}
                  />

                  <p className="text-xs">Step duration</p>
                  <div className="flex">
                    <NumberInput
                      name={`cook_time_hours_${step.id}`}
                      labelPlacement="outside"
                      placeholder="hrs"
                      minValue={0}
                      maxValue={59}
                      endContent={<p className="text-slate-500">hours</p>}
// @ts-ignore
                      onChange={(e) => setSteps(old => old.map(s => s.id == step.id ? {...s, hours: isNaN(e as number) ? step.hours : e}: s))}
                    />
                    <NumberInput
                      name={`cook_time_minutes_${step.step_no}`}
                      labelPlacement="outside"
                      placeholder="min"
                      minValue={0}
                      endContent={<p className="text-slate-500">minutes</p>}
// @ts-ignore
                      onChange={(e) => setSteps(old => old.map(s => s.id == step.id ? {...s, minutes: isNaN(e as number) ? step.minutes : e}: s))}
                    />
                  </div>
                </div>
              );
            })}
            <Button type="button" onPress={handleAddStep} className="w-fit">
              Add +
            </Button>
          </div>
          <p>Total Cook &amp; Prep Time: {totalDuration}</p>
        </div>

        <div>
          <label className="block font-semibold mb-1">Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full border rounded p-2"
          />
        </div>

        <Button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Recipe
        </Button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}
