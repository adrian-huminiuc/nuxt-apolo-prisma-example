<template>
  <div class="px-4 py-2 sm:px-6 shadow-md">
    <div class="space-y-12">
      <div class="border-b border-gray-900/10 pb-6">
        <h2 class="text-base font-semibold leading-7 text-gray-900">
          {{ $t("transaction") }}
        </h2>
        <div class="grid gap-x-3 gap-y-4 sm:grid-cols-2">
          <InputWrapper label="id">
            <input
              type="text"
              disabled="disabled"
              :value="data.transaction.id"
              class="input input-bordered input-md w-4/12"
            />
          </InputWrapper>
          <InputWrapper label="reference">
            <input
              type="text"
              disabled="disabled"
              :value="data.transaction.reference"
              class="input input-bordered input-md w-4/12"
            />
          </InputWrapper>
          <InputWrapper label="account">
            <input
              type="text"
              disabled="disabled"
              :value="data.transaction.account.name"
              class="input input-bordered input-md w-4/12"
            />
          </InputWrapper>
          <InputWrapper label="bank">
            <input
              type="text"
              disabled="disabled"
              :value="data.transaction.account.bank"
              class="input input-bordered input-md w-4/12"
            />
          </InputWrapper>

          <InputWrapper label="amount">
            <div class="flex items-center">
              <input
                type="text"
                disabled="disabled"
                :value="Number(data.transaction.amount).toFixed(2)"
                class="input input-bordered input-md w-4/12"
              />
              <span class="text-sm ml-5 font-semibold">
                {{ data.transaction.currency }}
              </span>
            </div>
          </InputWrapper>

          <InputWrapper label="category">
            <div class="flex items-center">
              <Category
                class="block w-80 mr-5"
                :color="data.transaction.category.color"
                :name="data.transaction.category.name"
              ></Category>

              <button
                v-if="!editMode"
                @click.prevent="editMode = !editMode"
                class="btn btn-sm hover:bg-indigo-500 mr-5"
              >
                {{ $t("edit") }}
              </button>
            </div>
            <CategoriesEdit
              v-if="editMode"
              @categorySet="onCategorySet()"
              :transaction="data.transaction"
            ></CategoriesEdit>
          </InputWrapper>
        </div>
      </div>

      <button @click.prevent="navigateTo('/')" class="btn">
        {{ $t("back") }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Transaction } from "~/models/Transaction";
import Category from "~/components/screen/categories/CategoryChip.vue";
import { reactive } from "vue";
import InputWrapper from "~/components/base/form/InputWrapper.vue";
import CategoriesEdit from "~/components/screen/categories/CategoriesEdit.vue";

const route = useRoute();
const editMode = useState("editMode", () => false);

const query = gql`
  query ($transactionId: String) {
    transaction(id: $transactionId) {
      id
      reference
      amount
      date
      currency
      account {
        name
        bank
      }
      category {
        id
        name
        color
      }
    }
  }
`;

const variables = reactive({
  transactionId: route.params.id,
});

const { data, refresh }: { data: { transaction: Transaction } } =
  await useAsyncQuery(query, variables);

const onCategorySet = async () => {
  await refresh();
  editMode.value = false;
};

watch(variables, refresh);
</script>
