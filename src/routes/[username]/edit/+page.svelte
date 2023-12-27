<script lang="ts">
  import { writable } from "svelte/store";
  import {
    arrayRemove,
    arrayUnion,
    doc,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import { page } from "$app/stores";
  import { db, userData, user } from "$lib/firebase";
  import UserLink from "$lib/components/UserLink.svelte";
  import SortableList from "$lib/components/SortableList.svelte";

  const icons = [
    "Twitter",
    "YouTube",
    "TikTok",
    "LinkedIn",
    "GitHub",
    "Custom",
  ];

  const formDefaults = {
    icon: "custom",
    title: "",
    url: "https://",
  };

  const formData = writable(formDefaults);

  let showForm = false;

  $: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
  $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
  $: formIsValid = urlIsValid && titleIsValid;

  async function toggleProfileStatus() {}

  function sortList(e: CustomEvent) {
    const newList = e.detail;
    const userRef = doc(db, "users", $user!.uid);
    setDoc(userRef, { links: newList }, { merge: true });
  }

  async function addLink(e: SubmitEvent) {
    const userRef = doc(db, "users", $user!.uid);

    await updateDoc(userRef, {
      links: arrayUnion({
        ...$formData,
        id: Date.now().toString(),
      }),
    });

    // BUG: This isn't clearing the form inputs, neither here or in cancel()
    formData.set(formDefaults);
    showForm = false;
  }

  async function deleteLink(item: any) {
    const userRef = doc(db, "users", $user!.uid);
    await updateDoc(userRef, {
      links: arrayRemove(item),
    });
  }

  function cancel() {
    formData.set(formDefaults);
    showForm = false;
  }
</script>

<main class="w-full max-w-xl mx-auto text-center">
  {#if $userData?.username == $page.params.username}
    <h1 class="mx-2 text-2xl font-bold mt-8 mb-4 text-center">
      Edit your Profile
    </h1>

    <div class="text-center mb-8">
      <p>
        Profile Link:
        <a href={`/${$userData?.username}`} class="link link-accent"
          >@{$userData?.username}</a
        >
      </p>
    </div>

    <div class="text-center my-4">
      <a class="btn btn-outline btn-xs" href="/login/photo">Change photo</a>
      <a class="btn btn-outline btn-xs" href={`/${$userData.username}/bio`}
        >Edit bio</a
      >
    </div>

    <form class="form-control">
      <label class="label cursor-pointer flex items-start justify-center">
        <span class="label-text mr-6">
          <div
            class="tooltip group-hover:tooltip-open"
            data-tip="If public, the world can see your profile"
          >
            NOT HOOKED UP
          </div>
        </span>
        <input
          type="checkbox"
          class="toggle toggle-success"
          checked={$userData?.published}
          on:change={toggleProfileStatus}
        />
      </label>
    </form>

    <p class="text-xl my-8">{$userData.bio ?? "no bio yet..."}</p>

    <!-- on:sort={} is the dispatched custom event from within SortableList, letting this parent component trigger off of it -->
    <SortableList list={$userData?.links} on:sort={sortList} let:item let:index>
      <div class="group relative">
        <UserLink {...item} />
        <button
          on:click={() => deleteLink(item)}
          class="btn btn-xs btn-error absolute -right-6 bottom-10 invisible group-hover:visible transition-all"
          >Delete</button
        >
      </div>
    </SortableList>

    {#if showForm}
      <form
        on:submit|preventDefault={addLink}
        class="bg-base-200 p-6 w-full mx-auto rounded-xl"
      >
        <select
          name="icon"
          class="select select-sm"
          bind:value={$formData.icon}
        >
          {#each icons as icon}
            <option value={icon.toLowerCase()}>{icon}</option>
          {/each}
        </select>
        <input
          name="title"
          type="text"
          placeholder="Link title"
          class="input input-sm"
          bind:value={$formData.title}
        />
        <input
          name="url"
          type="text"
          placeholder="URL"
          class="input input-sm"
          bind:value={$formData.url}
        />

        <div class="my-4">
          {#if !titleIsValid}
            <p class="text-error text-xs">Keep title less than 20 characters</p>
          {/if}
          {#if !urlIsValid}
            <p class="text-error text-xs">Enter a valid URL</p>
          {/if}
          {#if formIsValid}
            <p class="text-success text-xs">Looks good!</p>
          {/if}
        </div>

        <button
          type="submit"
          class="btn btn-success block"
          disabled={!formIsValid}>Add Link</button
        >
        <button type="button" class="btn btn-xs my-4" on:click={cancel}
          >Cancel</button
        >
      </form>
    {:else}
      <button
        on:click={() => (showForm = true)}
        class="btn btn-outline btn-info block mx-auto my-4">Add a Link</button
      >
    {/if}
  {:else}
    <h2>Cannot edit this page. Head to your dashboard</h2>
  {/if}
</main>
