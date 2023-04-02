<template>
  <table class="table w-full text-sm">
    <thead class="border-b">
      <tr>
        <th style="width: 30%">{{ $t("reference") }}</th>
        <th style="width: 40%">{{ $t("category") }}</th>
        <th @click="setSortingBy('date')" class="cursor-pointer flex">
          <SortIcon
            v-if="internalOrderBy.field === 'date'"
            :direction="internalOrderBy.dir"
          ></SortIcon>

          {{ $t("date") }}
        </th>
        <th class="text-right">{{ $t("amount") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in transactions"
        :key="item.id"
        @click="goToDetailPage(item.id)"
        class="cursor-pointer hover"
      >
        <td>
          <span v-if="item.reference">
            {{ item.reference }}
          </span>
          <span class="text-gray-400" v-else>
            {{ $t("no_reference_provided") }}
          </span>
        </td>
        <td>
          <Category
            :color="item.category.color"
            :name="item.category.name"
          ></Category>
        </td>
        <td>
          {{ formatInTimeZone(new Date(item.date), "UTC", "dd-MM-yyyy") }}
        </td>

        <td class="text-right">
          <span class="mr-1">{{ Number(item.amount).toFixed(2) }}</span>
          <span class="font-semibold">{{ item.currency }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import Table from "~/pages/table.vue";
import { type PropType } from "vue";
import { Transaction } from "~/models/Transaction";
import SortIcon from "~/components/base/table/SortIcon.vue";
import { Sort } from "~/models/Sort";
import Category from "~/components/screen/categories/CategoryChip.vue";
import { formatInTimeZone } from "date-fns-tz";

const props = defineProps({
  transactions: {
    type: Array as PropType<Transaction[]>,
    required: true,
    default: [],
  },
  orderBy: {
    type: Object as PropType<Sort>,
    required: true,
  },
});

const internalOrderBy = reactive({
  field: props.orderBy?.field,
  dir: props.orderBy?.dir,
});

const emit = defineEmits(["sortChanged"]);
const setSortingBy = (field: string) => {
  if (internalOrderBy.field === field) {
    internalOrderBy.dir = internalOrderBy.dir === "asc" ? "desc" : "asc";
  } else {
    internalOrderBy.dir = "asc";
  }
  internalOrderBy.field = field;

  emit("sortChanged", internalOrderBy);
};

const router = useRouter();
const goToDetailPage = async (id) => await router.push(`transactions/${id}`);
</script>
