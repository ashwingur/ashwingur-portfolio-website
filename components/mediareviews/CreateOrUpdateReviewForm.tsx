import TipTap from "@components/TipTap";
import clsx from "clsx";
import React, { useEffect } from "react";
import { Controller, FieldError, useForm } from "react-hook-form";
import {
  MediaReview,
  getDefaultMediaReview,
  mediaReviewSchema,
} from "shared/validations/mediaReviewSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiValue } from "react-select";
import GenericMultiSelect from "@components/GenericMultiSelect";
import GenericListbox from "@components/GenericListBox";
import { useQueryClient } from "react-query";
import { AiOutlineLoading } from "react-icons/ai";
import {
  QUERY_KEY,
  useCreateOrUpdateMediaReview,
} from "shared/queries/mediareviews";
import RHFInput from "./RHFInput";
import RHFControllerInput from "./RHFControllerInput";

interface CreateOrUpdateReviewFormProps {
  existingData?: MediaReview;
  onSubmitSuccess?: () => void;
  className?: string;
}

type Schema = z.infer<typeof mediaReviewSchema>;

const mediaTypes = ["Movie", "Book", "Show", "Game", "Music"];

interface GenreOption {
  value: string;
  label: string;
}

const predefinedGenres: GenreOption[] = [
  { value: "Action", label: "Action" },
  { value: "Adventure", label: "Adventure" },
  { value: "Comedy", label: "Comedy" },
  { value: "Crime", label: "Crime" },
  { value: "Drama", label: "Drama" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Historical", label: "Historical" },
  { value: "Horror", label: "Horror" },
  { value: "Mystery", label: "Mystery" },
  { value: "Romance", label: "Romance" },
  { value: "Science Fiction", label: "Science Fiction" },
  { value: "Thriller", label: "Thriller" },
  { value: "Western", label: "Western" },
  { value: "Animation", label: "Animation" },
  { value: "Biography", label: "Biography" },
  { value: "Documentary", label: "Documentary" },
  { value: "Family", label: "Family" },
  { value: "Musical", label: "Musical" },
  { value: "War", label: "War" },
  { value: "Sports", label: "Sports" },
  { value: "Superhero", label: "Superhero" },
  { value: "Martial Arts", label: "Martial Arts" },
  { value: "Steampunk", label: "Steampunk" },
  { value: "Cyberpunk", label: "Cyberpunk" },
  { value: "Noir", label: "Noir" },
  { value: "Dystopian", label: "Dystopian" },
  { value: "Utopian", label: "Utopian" },
  { value: "Paranormal", label: "Paranormal" },
  { value: "Psychological", label: "Psychological" },
  { value: "Political", label: "Political" },
  { value: "Satire", label: "Satire" },
  { value: "Tragedy", label: "Tragedy" },
  { value: "Spy", label: "Spy" },
  { value: "Apocalyptic", label: "Apocalyptic" },
  { value: "Dystopian", label: "Dystopian" },
  { value: "Bollywood", label: "Bollywood" },
  { value: "RPG", label: "RPG" },
  { value: "ARPG", label: "ARPG" },
  { value: "Simulation", label: "Simulation" },
  { value: "Strategy", label: "Strategy" },
  { value: "Sports", label: "Sports" },
  { value: "Puzzle", label: "Puzzle" },
  { value: "Idle", label: "Idle" },
  { value: "Casual", label: "Casual" },
  { value: "Shooter", label: "Shooter" },
  { value: "Fighting", label: "Fighting" },
  { value: "Racing", label: "Racing" },
  { value: "Stealth", label: "Stealth" },
  { value: "Survival", label: "Survival" },
  { value: "Horror", label: "Horror" },
  { value: "Platformer", label: "Platformer" },
  { value: "Music", label: "Music" },
  { value: "Party", label: "Party" },
  { value: "Board", label: "Board" },
  { value: "Card", label: "Card" },
  { value: "Trivia", label: "Trivia" },
  { value: "Educational", label: "Educational" },
  { value: "Single Player", label: "Single Player" },
  { value: "MMORPG", label: "MMORPG" },
  { value: "MOBA", label: "MOBA" },
  { value: "Sandbox", label: "Sandbox" },
  { value: "Tower Defense", label: "Tower Defense" },
  { value: "Metroidvania", label: "Metroidvania" },
  { value: "Visual Novel", label: "Visual Novel" },
  { value: "Roguelike", label: "Roguelike" },
  { value: "Indie", label: "Indie" },
  { value: "Soundtrack", label: "Soundtrack" },
  { value: "Orchestral", label: "Orchestral" },
];

const CreateOrUpdateReviewForm: React.FC<CreateOrUpdateReviewFormProps> = ({
  existingData,
  onSubmitSuccess,
  className,
}) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    getValues,
  } = useForm<Schema>({
    resolver: zodResolver(mediaReviewSchema),
    defaultValues: existingData ?? getDefaultMediaReview(),
  });

  // If we change the existing data from parent component, it will populate the new values
  useEffect(() => {
    if (existingData) {
      reset(existingData);
    }
  }, [existingData, reset]);

  const onMutationSuccess = (data: MediaReview) => {
    // Convert media_creation_date to the format yyyy-MM-ddThh:mm
    let media_creation_date: null | Date = null;
    if (data.media_creation_date) {
      media_creation_date = new Date(data.media_creation_date);
    }
    const formattedMediaCreationDate =
      media_creation_date?.toISOString().slice(0, 16) ?? null;

    reset({ ...data, media_creation_date: formattedMediaCreationDate });

    queryClient.invalidateQueries(QUERY_KEY);

    onSubmitSuccess && onSubmitSuccess();
  };

  const mutation = useCreateOrUpdateMediaReview(onMutationSuccess);

  const onSubmit = (data: Schema) => {
    const parsedMediaCreationDate = data.media_creation_date
      ? new Date(data.media_creation_date).toISOString()
      : null;
    const parsedConsumedDate = data.consumed_date
      ? new Date(data.consumed_date).toISOString()
      : null;

    const transformedData: Schema = {
      ...data,
      media_creation_date: parsedMediaCreationDate,
      consumed_date: parsedConsumedDate,
    };

    mutation.mutate(transformedData);
  };

  let prosErrorMessages: JSX.Element[] = [];
  if (errors.pros) {
    const length = errors.pros.length ?? 0;
    for (let i = 0; i < length ?? 0; i++) {
      if (errors.pros[i]) {
        prosErrorMessages.push(
          <p key={i} className="text-error">
            {errors.pros[i]?.message} (line: {i + 1})
          </p>
        );
      }
    }
  }
  let consErrorMessages: JSX.Element[] = [];
  if (errors.cons) {
    const length = errors.cons.length ?? 0;
    for (let i = 0; i < length ?? 0; i++) {
      if (errors.cons[i]) {
        consErrorMessages.push(
          <p key={i} className="text-error">
            {errors.cons[i]?.message} (line: {i + 1})
          </p>
        );
      }
    }
  }

  const id = getValues().id;

  return (
    <div className={clsx(className, mutation.isLoading ? "animate-pulse" : "")}>
      {id && <h2 className="text-center">Currently Editing ID: {id}</h2>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <RHFInput
          label="Name"
          register={register("name")}
          errors={errors.name}
        />
        <RHFControllerInput label="Media Type">
          <Controller
            name="media_type"
            control={control}
            render={({ field }) => {
              return (
                <GenericListbox<string>
                  selectedValue={
                    mediaTypes.find((i) => i === field.value) ?? mediaTypes[0]
                  }
                  onSelectedValueChange={(value) => field.onChange(value)}
                  options={mediaTypes}
                  displayValue={(option) => option}
                  className="w-11/12 md:w-4/5 mx-auto"
                  muted={true}
                />
              );
            }}
          />
        </RHFControllerInput>
        <RHFInput
          label="Cover Image URL"
          register={register("cover_image")}
          errors={errors.cover_image}
        />
        <RHFInput
          label="Rating"
          register={register("rating")}
          errors={errors.rating}
          type="number"
          step="0.1"
        />
        <div className="flex flex-col gap-1">
          <label className="w-11/12 md:w-4/5 mx-auto">Review Content:</label>
          <Controller
            name="review_content"
            control={control}
            render={({ field }) => (
              <TipTap
                value={field.value || ""}
                onChange={field.onChange}
                className="w-11/12 md:w-4/5 bg-background-muted mx-auto"
              />
            )}
          />
        </div>
        <RHFInput
          label="Word Count"
          register={register("word_count")}
          errors={errors.word_count}
          type="number"
        />
        <RHFInput
          label="Run Time (minutes)"
          register={register("run_time")}
          errors={errors.run_time}
          type="number"
        />
        <RHFInput
          label="Creator"
          register={register("creator")}
          errors={errors.creator}
        />
        <RHFInput
          label="Media Creation Date"
          register={register("media_creation_date")}
          errors={errors.media_creation_date}
          type="datetime-local"
        />
        <RHFInput
          label="Date Consumed"
          register={register("consumed_date")}
          errors={errors.consumed_date}
          type="datetime-local"
        />

        <RHFControllerInput
          label="Genres"
          // Display the first error that appears
          errors={
            errors.genres &&
            (errors.genres as (FieldError | undefined)[])?.find(
              (e) => e !== undefined
            )
          }
        >
          <Controller
            name="genres"
            control={control}
            render={({ field }) => {
              // Filter out selected genres from options
              const filteredOptions = predefinedGenres
                .filter(
                  (genre) =>
                    !(field.value || []).some(
                      (selectedGenre: string) => selectedGenre === genre.value
                    )
                )
                .sort((a, b) => a.value.localeCompare(b.value));

              return (
                <GenericMultiSelect<GenreOption>
                  options={filteredOptions}
                  value={(field.value || []).map((genre: string) => ({
                    value: genre,
                    label: genre,
                  }))}
                  onChange={(selectedGenres: MultiValue<GenreOption>) =>
                    field.onChange(selectedGenres.map((genre) => genre.value))
                  }
                  displayKey="label"
                  className=" border-2 border-text-muted rounded-full"
                />
              );
            }}
          />
        </RHFControllerInput>

        <RHFControllerInput
          label="Pros (each new line is a separator)"
          errors={
            errors.pros &&
            (errors.pros as (FieldError | undefined)[])?.find(
              (e) => e !== undefined
            )
          }
        >
          <Controller
            name="pros"
            control={control}
            render={({ field }) => (
              <textarea
                className="input !rounded-xl "
                {...field}
                value={field.value?.join("\n") || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(
                    value === ""
                      ? []
                      : value.split("\n").map((item) => item.trim())
                  );
                }}
                aria-invalid={errors.pros !== undefined}
                rows={4} // Adjust the number of rows as needed
              />
            )}
          />
        </RHFControllerInput>

        <RHFControllerInput
          label="Cons (each new line is a separator)"
          errors={
            errors.cons &&
            (errors.cons as (FieldError | undefined)[])?.find(
              (e) => e !== undefined
            )
          }
        >
          <Controller
            name="cons"
            control={control}
            render={({ field }) => (
              <textarea
                className="input !rounded-xl"
                {...field}
                value={field.value?.join("\n") || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(
                    value === ""
                      ? []
                      : value.split("\n").map((item) => item.trim())
                  );
                }}
                aria-invalid={errors.cons !== undefined}
                rows={4} // Adjust the number of rows as needed
              />
            )}
          />
        </RHFControllerInput>
        <RHFInput
          label="Visible"
          register={register("visible")}
          errors={errors.visible}
          type="checkbox"
        />

        <button
          disabled={mutation.isLoading}
          className="btn self-center w-36 flex items-center justify-center h-10"
          type="submit"
        >
          {mutation.isLoading ? (
            <AiOutlineLoading className="animate-spin text-xl" />
          ) : getValues().id ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>
        <div className="min-h-6 mt-2">
          {mutation.isError && mutation.error instanceof Error && (
            <p className="text-lg text-error text-center">
              {mutation.error.message}
            </p>
          )}

          {mutation.isSuccess && <p className="text-center">Success</p>}
        </div>
      </form>
    </div>
  );
};

export default CreateOrUpdateReviewForm;
