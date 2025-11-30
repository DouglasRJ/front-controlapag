import { ThemedText } from "@/components/themed-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react";
import { View, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";

type RevenueChartProps = {
  data?: { date: string; revenue: number }[];
  isLoading?: boolean;
  period?: "7d" | "30d" | "90d";
};

export function RevenueChart({
  data = [],
  isLoading = false,
  period = "30d",
}: RevenueChartProps) {
  const { width: screenWidth, height } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = React.useState(screenWidth - 80);
  // Altura responsiva baseada no tamanho da tela (mínimo 200, máximo 400)
  const chartHeight = Math.max(200, Math.min(400, height * 0.3));

  // Cor primária do tema
  const primaryColor = "#FD5001";

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <ThemedText className="text-xl font-semibold">Receita</ThemedText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <View style={{ height: chartHeight }} className="items-center justify-center">
            <ThemedText className="text-sm text-foreground/60">
              Carregando dados...
            </ThemedText>
          </View>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <ThemedText className="text-xl font-semibold">Receita</ThemedText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <View style={{ height: chartHeight }} className="items-center justify-center">
            <ThemedText className="text-sm text-foreground/60">
              Nenhum dado disponível
            </ThemedText>
          </View>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

  // Agrupar dados para reduzir pontos no gráfico, mas manter mais pontos que antes
  const groupData = () => {
    const grouped: { date: string; revenue: number }[] = [];
    // Para 7 dias: mostrar todos os dias
    // Para 30 dias: agrupar em 2 dias (15 pontos)
    // Para 90 dias: agrupar em 7 dias (13 pontos)
    const daysPerGroup = period === "7d" ? 1 : period === "30d" ? 2 : 7;

    for (let i = 0; i < data.length; i += daysPerGroup) {
      const group = data.slice(i, i + daysPerGroup);
      const groupRevenue = group.reduce((sum, d) => sum + d.revenue, 0);
      const groupDate = group[0].date;
      grouped.push({
        date: groupDate,
        revenue: groupRevenue,
      });
    }
    return grouped;
  };

  const chartData = groupData();

  // Converter dados para o formato esperado pelo react-native-gifted-charts
  const lineChartData = chartData.map((item, index) => {
    // Mostrar labels apenas em alguns pontos para não ficar poluído
    const showLabel =
      index === 0 ||
      index === chartData.length - 1 ||
      (chartData.length > 5 && index % Math.ceil(chartData.length / 4) === 0);

    return {
      value: item.revenue,
      label: showLabel ? format(new Date(item.date), "dd/MM", { locale: ptBR }) : "",
      labelTextStyle: {
        color: "#6b7280",
        fontSize: 10,
      },
    };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <ThemedText className="text-xl font-semibold">Receita</ThemedText>
        </CardTitle>
        <View className="mt-2">
          <ThemedText className="text-2xl font-bold text-primary">
            {formatCurrency(totalRevenue)}
          </ThemedText>
          <ThemedText className="text-xs text-foreground/60 mt-1">
            Período: {period === "7d" ? "7 dias" : period === "30d" ? "30 dias" : "90 dias"}
          </ThemedText>
        </View>
      </CardHeader>
      <CardContent>
        <View
          style={{ height: chartHeight, paddingVertical: 8 }}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setContainerWidth(width);
          }}
        >
          {containerWidth > 0 && (
            <LineChart
              data={lineChartData}
              width={100000}
              height={chartHeight - 32}
              color={primaryColor}
              thickness={3}
              curved
              areaChart
              startFillColor={primaryColor}
              endFillColor={primaryColor}
              startOpacity={0.2}
              endOpacity={0}
              spacing={chartData.length > 10 ? 20 : 40}
              hideRules
              hideYAxisText
              yAxisColor="transparent"
              xAxisColor="#e5e7eb"
              xAxisLabelTextStyle={{
                color: "#6b7280",
                fontSize: 10,
              }}
              dataPointsColor={primaryColor}
              dataPointsRadius={4}
              textShiftY={-2}
              textShiftX={-5}
              textFontSize={10}
              textColor="#6b7280"
              noOfSections={4}
              maxValue={Math.max(...chartData.map((d) => d.revenue), 1) * 1.1}
              yAxisTextStyle={{
                color: "#6b7280",
                fontSize: 10,
              }}
              formatYLabel={(value) => {
                const num = parseFloat(value);
                if (num >= 1000) {
                  return `R$ ${(num / 1000).toFixed(1)}k`;
                }
                return `R$ ${num.toFixed(0)}`;
              }}
              rulesType="solid"
              rulesColor="#e5e7eb"
            />
          )}
        </View>
      </CardContent>
    </Card>
  );
}

