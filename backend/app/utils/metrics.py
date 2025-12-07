from app.models.responses import StrategyResult
from typing import List

def rank_by_accuracy(results: List[StrategyResult]) -> List[StrategyResult]:
    """Sort results by accuracy descending"""
    return sorted(results, key=lambda x: x.accuracy, reverse=True)

def find_best_strategy(results: List[StrategyResult]) -> str:
    """Find strategy with highest accuracy"""
    if not results:
        return "No results"
    best = max(results, key=lambda x: x.accuracy)
    return best.strategy_name

def find_most_cost_effective(results: List[StrategyResult]) -> StrategyResult:
    """Find strategy with lowest cost"""
    return min(results, key=lambda x: x.cost)

def find_fastest(results: List[StrategyResult]) -> StrategyResult:
    """Find strategy with lowest processing time"""
    return min(results, key=lambda x: x.processing_time_ms)

def generate_insights(results: List[StrategyResult]) -> List[str]:
    """Generate insights from results"""
    if not results:
        return ["No results to analyze"]

    insights = []

    # Best accuracy
    best = max(results, key=lambda x: x.accuracy)
    insights.append(
        f"{best.strategy_name} achieved highest accuracy at {best.accuracy*100:.1f}% "
        f"with {best.relevance*100:.1f}% relevance"
    )

    # Most cost-effective
    cheapest = min(results, key=lambda x: x.cost)
    insights.append(
        f"{cheapest.strategy_name} is most cost-effective at ${cheapest.cost:.6f}"
    )

    # Fastest
    fastest = min(results, key=lambda x: x.processing_time_ms)
    insights.append(
        f"{fastest.strategy_name} was fastest at {fastest.processing_time_ms}ms"
    )

    # Accuracy range
    accuracies = [r.accuracy for r in results]
    acc_range = max(accuracies) - min(accuracies)
    if acc_range > 0.15:  # 15% difference
        insights.append(
            f"Significant accuracy variation ({acc_range*100:.1f}%) - strategy choice matters"
        )
    else:
        insights.append(
            f"Similar accuracy across strategies ({acc_range*100:.1f}% range) - consider cost/speed"
        )

    return insights

def analyze_batch_results(query_results: List) -> tuple[str, List[str]]:
    """Analyze results across multiple queries"""
    if not query_results:
        return "No results", ["No queries analyzed"]

    # Count wins per strategy
    strategy_wins = {}
    strategy_accuracies = {}

    for qr in query_results:
        winner = qr["best_strategy"]
        strategy_wins[winner] = strategy_wins.get(winner, 0) + 1

        # Collect accuracies for each strategy
        for result in qr["all_results"]:
            strategy_name = result.strategy_name
            if strategy_name not in strategy_accuracies:
                strategy_accuracies[strategy_name] = []
            strategy_accuracies[strategy_name].append(result.accuracy)

    # Find overall winner (most wins)
    overall_winner = max(strategy_wins.items(), key=lambda x: x[1])[0]

    # Calculate average accuracies
    avg_accuracies = {
        name: sum(accs) / len(accs)
        for name, accs in strategy_accuracies.items()
    }

    # Generate insights
    insights = []

    # Insight 1: Winner announcement
    total_queries = len(query_results)
    win_count = strategy_wins[overall_winner]
    insights.append(
        f"{overall_winner} won {win_count}/{total_queries} queries "
        f"({win_count*100//total_queries}% win rate)"
    )

    # Insight 2: Average accuracy
    winner_avg = avg_accuracies[overall_winner]
    insights.append(
        f"{overall_winner} achieved {winner_avg*100:.1f}% average accuracy across all queries"
    )

    # Insight 3: Consistency
    winner_accs = strategy_accuracies[overall_winner]
    variance = max(winner_accs) - min(winner_accs)
    if variance < 0.1:
        insights.append(
            f"{overall_winner} showed high consistency (variance: {variance*100:.1f}%)"
        )
    else:
        insights.append(
            f"{overall_winner} showed some variance ({variance*100:.1f}%) across query types"
        )

    # Insight 4: Runner-up
    sorted_by_avg = sorted(avg_accuracies.items(), key=lambda x: x[1], reverse=True)
    if len(sorted_by_avg) > 1:
        runner_up = sorted_by_avg[1]
        insights.append(
            f"Runner-up: {runner_up[0]} with {runner_up[1]*100:.1f}% average accuracy"
        )

    return overall_winner, insights
