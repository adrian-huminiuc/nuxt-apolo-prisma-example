<template>
  <div class="col-span-full py-5 flex">
    <div class="inline-flex flex-col justify-center relative text-gray-500">
      <label class="block text-sm font-medium leading-6 text-gray-900">
        {{ $t("set_new_category") }}
      </label>
      <div class="relative">
        <input
          type="text"
          class="text p-2 pl-8 w-80 rounded border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
          :placeholder="$t('search')"
          v-model="searchVariables.categoryName"
        />
        <MagnifyingGlassIcon
          class="w-4 h-4 absolute left-2.5 top-3.5"
        ></MagnifyingGlassIcon>
      </div>
      <ul
        v-if="
          data.categories.length > 0 && searchVariables.categoryName.length > 0
        "
        class="w-80 bg-white border border-gray-100 w-full mt-2"
      >
        <li
          v-for="item in data.categories"
          class="pl-1 pr-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900 flex items-center justify-between"
        >
          <Category
            :color="item.color"
            :name="item.name"
            :key="item.id"
          ></Category>
          <button
            v-if="item.id !== transaction.category.id"
            @click.prevent="setCategoryAction(transaction.id, item.id)"
            class="btn btn-sm bg-indigo-600 rounded-sm"
          >
            {{ $t("set") }}
          </button>
        </li>
      </ul>
      <ul
        v-if="
          data.categories.length === 0 &&
          searchVariables.categoryName.length > 0
        "
      >
        <li
          class="w-80 mt-2 pr-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900"
        >
          <label class="block text-sm font-medium leading-6 text-gray-900">
            {{
              $t("category_not_found_create_new_one", [
                searchVariables.categoryName,
              ])
            }}
          </label>
          <div class="flex items-center justify-between">
            <input
              :title="$t('chose_color')"
              type="color"
              class="cursor-pointer mx-5"
              required="required"
              v-model="mutateVariables.color"
            />

            <button
              type="submit"
              @click.prevent="addCategoryAction()"
              class="btn btn-sm bg-indigo-600 rounded-sm"
            >
              {{ $t("save") }}
            </button>
          </div>
          <div
            v-if="saveError"
            class="mt-2 alert alert-error shadow-lg break-word"
          >
            <span>{{ $t(saveError.toString()) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Transaction } from "~/models/Transaction";
import Category from "~/components/screen/categories/CategoryChip.vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { PropType, reactive } from "vue";

const props = defineProps({
  transaction: {
    type: Object as PropType<Transaction>,
    required: true,
  },
});

const saveError = ref("");
const resetError = () => (saveError.value = "");
const emit = defineEmits(["categorySet"]);

const query = gql`
  query ($categoryName: String) {
    categories(categoryName: $categoryName) {
      id
      name
      color
    }
  }
`;

const addCategoryMutation = gql`
  mutation ($input: CreateCategoryInput) {
    addCategory(input: $input) {
      id
      name
      color
    }
  }
`;

const mutationSetCategory = gql`
  mutation ($input: SetCategory) {
    setCategory(input: $input) {
      id
    }
  }
`;

const searchVariables = reactive({
  categoryName: "",
});

const mutateVariables = reactive({
  name: "",
  color: "#ff0000",
});

const { mutate: addCategory } = useMutation(addCategoryMutation);
const { mutate: setCategory } = useMutation(mutationSetCategory);

const addCategoryAction = async () => {
  mutateVariables.name = searchVariables.categoryName;
  resetError();

  try {
    await addCategory({ input: mutateVariables });
    refresh();
  } catch (e) {
    saveError.value = e.message;
  }
};

const setCategoryAction = async (transactionId, categoryId) => {
  await setCategory({ input: { transactionId, categoryId } });
  emit("categorySet");
};

const {
  data,
  refresh,
}: { data: { transaction: Transaction; categories: Category[] } } =
  await useAsyncQuery(query, searchVariables);

watch(searchVariables, () => {
  refresh();
  resetError();
});
</script>
