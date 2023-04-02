<template>
    <div class='overflow-hidden bg-white shadow-xl sm:rounded-lg'>
        <div class='px-4 py-5 sm:px-6'>
            <h3 class='font-semibold leading-6 text-gray-900'>{{ $t('transactions') }}</h3>
            <div
                class='text-sm mt-1 pb-5 text-gray-500 flex flex-wrap justify-between'
            >
                <div class='form-control w-[35%]'>
                    <label class='label'>{{ $t('search') }}</label>
                    <input
                        type='text'
                        v-model='variables.search'
                        @input='variables.pagination.page = 1'
                        :placeholder="$t('search_placeholder')"
                        class='input input-bordered input-primary p-1 placeholder:text-sm'
                    />
                </div>

                <div class='form-control w-[15%]'>
                    <label class='label'>{{ $t('bank') }}</label>
                    <select
                        v-model='variables.filterBy.bank'
                        class='select select-secondary'
                    >
                        <option value=''>{{ $t('none') }}</option>
                        <option v-for='item in data.banks' :key="item.name + 'bank'">
                            {{ item.name }}
                        </option>
                    </select>
                </div>

                <div class='form-control w-[15%]'>
                    <label class='label'>Account</label>
                    <select
                        v-model='variables.filterBy.account'
                        class='select select-secondary'
                    >
                        <option value=''>{{ $t('none') }}</option>
                        <option v-for='item in data.accounts' :key="item.name + 'account'">
                            {{ item.name }}
                        </option>
                    </select>
                </div>
                <div class='form-control w-[10%]'>
                    <label class='label'>{{ $t('start_month') }}</label>
                    <input
                        class='input input-bordered input-primary p-1 text-xs'
                        type='month'
                        v-model='variables.filterBy.startMonth'
                    />
                </div>
                <div class='form-control w-[10%]'>
                    <label class='label'>{{ $t('end_month') }}</label>
                    <input
                        class='input input-bordered input-primary p-1 text-xs'
                        type='month'
                        v-model='variables.filterBy.endMonth'
                    />
                </div>
            </div>
            <div class='pt-5 border-t border-gray-200'>
                <div class='overflow-x-auto'>
                    <AllTransactionsTable
                        :transactions='data.transactions'
                        :order-by='variables.orderBy'
                        @sort-changed='args => variables.orderBy = args'
                    ></AllTransactionsTable>
                </div>
                <div class='flex justify-center'>
                    <div class='btn-group'>
                        <button
                            v-if='variables.pagination.page > 1'
                            class='btn'
                            @click='variables.pagination.page = 1'
                        >
                            «
                        </button>
                        <button
                            :disabled='variables.pagination.page <= 1'
                            class='btn'
                            @click='variables.pagination.page -= 1'
                        >
                            &#8676
                        </button>
                        <button class='btn'>
                            {{ $t('page_nr', [variables.pagination.page]) }}
                        </button>
                        <button :disabled='data.transactions.length < 10' class='btn'
                                @click.prevent='variables.pagination.page++'>
                            &#8677;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue';
import AllTransactionsTable from '~/components/screen/transactions/TransactionsTable.vue';
import { Transaction } from '~/models/Transaction';
import { Filter } from '~/models/Filter';

const query = gql`
  query (
    $search: String
    $filterBy: TransactionFilterByInput
    $orderBy: TransactionOrderByInput
    $pagination: PaginationInput
  ) {
     accounts {
       name
     }
     banks {
       name
     }
    transactions(
      search: $search
      filterBy: $filterBy
      orderBy: $orderBy
      pagination: $pagination
    ) {
      id
      reference
      date
      amount
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
    search: '',
    filterBy: {
        bank: '',
        account: '',
        endMonth: '',
        startMonth: '',
    },
    orderBy: {
        field: 'date',
        dir: 'desc',
    },
    pagination: {
        page: 1,
    },
});

type TransactionsQueryData = { transactions: Transaction[], accounts: Filter[], banks: Filter[] };
const { data, refresh }: { data: TransactionsQueryData } = await useAsyncQuery(query, variables);

watch(variables, refresh);
</script>

<style lang='postcss'>
.table :where(thead, tfoot) :where(th, td) {
    background-color: white !important;
}
</style>
