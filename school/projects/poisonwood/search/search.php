<?php
//error_reporting(E_ALL);
//ini_set('display_errors', '1');

$QUERY_LINKS = [
	[
		"queries" => ["price", "prices", "ruth may", "adah", "leah", "rachel", "orleanna", "nathan"],
		"name" => "Profile of the Price Family",
		"href" => "price.html"
	],
	[
		"queries" => ["ruth may", "price", "mother may i"],
		"name" => "Account of a game of Mother May I",
		"href" => "ruthmay.html"
	],
	[
		"queries" => ["adah", "price", "medical", "emory", "hospital"],
		"name" => "Interview with Adah Price, medical student",
		"href" => "adah.html"
	],
	[
		"queries" => ["leah", "price", "bethlehem", "missionary"],
		"name" => "Leah Price to go overseas on missionary trip",
		"href" => "leah.html"
	],
	[
		"queries" => ["rachel", "price", "axelroot", "dupree", "fairley", "equatorial"],
		"name" => "Visiting the Equatorial hotel",
		"href" => "rachel.html"
	],
	[
		"queries" => ["orleanna", "price", "obituary"],
		"name" => "Obituary: Orleanna Price",
		"href" => "orleanna.html"
	],
	[
		"queries" => ["nathan", "price", "report", "dead"],
		"name" => "Report: White Man Found Dead in Kilanga",
		"href" => "nathan.html"
	],
	[
		"queries" => ["anatole", "ngemba", "leah", "price", "arrest", "letter"],
		"name" => "Letter to Leah Price-Ngemba on the arrest of her husband, Anatole Ngemba",
		"href" => "anatole.html"
	]
];




if($_SERVER['REQUEST_METHOD'] == 'POST'){
	if($_POST['request'] == 'search'){
		$results = [
		];
		foreach($QUERY_LINKS as $entry){
			$matches = FALSE;
			foreach($entry["queries"] as $query){
				if(strpos($_POST['query'], $query) !== FALSE){
					$matches = TRUE;
				}
			}
			if($matches){
				$results[] = [
						"name" => $entry["name"],
						"href" => $entry["href"]
					];
			}
		}
		echo json_encode([
			"results"  => $results
		]);
	}
}
