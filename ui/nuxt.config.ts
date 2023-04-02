import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  components: [
    {
      path: "~/components",
      extensions: [".vue"],
    },
  ],
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n", "@nuxtjs/apollo"],
  buildDir: process.cwd() + "/.nuxt",
  srcDir: "src",
  pages: true,
  devServer: {
    port: Number(process.env.UI_PORT),
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: "http://ffdc-api.localhost/graphql",
      },
    },
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    vueI18n: {
      legacy: false,
      fallbackLocale: "en",
      messages: {
        en: {
          account: "Account",
          amount: "Amount",
          bank: "Bank",
          category: "Category",
          category_not_found_create_new_one:
            'Category "{0}" not found. Creat a new one?',
          chose_color: "Click to choose a color",
          date: "Date",
          end_month: "End Month",
          month_picker_placeholder: "yyyy-mm",
          no_filter_applied: "No filter applied",
          no_reference_provided: "No reference provided",
          none: "None",
          page_nr: "Page {0}",
          reference: "Reference",
          search: "Search",
          search_placeholder:
            "Search by bank, account, reference, category, date, amount ...",
          set_new_category: "Search new category",
          start_month: "Start Month",
          transaction: "Transaction",
          transactions: "Transactions",
          validation_category_name_too_short:
            "Category name is too short, must be longer than 3 chars!",
          validation_category_color_invalid_color: "Invalid color!",
        },
      },
    },
  },
});
