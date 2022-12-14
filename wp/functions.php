<?php
add_action( 'wp_enqueue_scripts', 'enqueue_parent_styles' );
function enqueue_parent_styles() {
	wp_enqueue_style( 'twentytwentytwo-child-style',
		get_stylesheet_uri(),
		array( 'twentytwentytwo-style' ),
		wp_get_theme()->get( 'Version' ) // This only works if you have Version defined in the style header.
	);
}

add_action('rest_api_init', 'mouse_api_routes');
function mouse_api_routes () {
  register_rest_route( 'mouse/v1', 
                       'latest-posts/(?P<category_id>\d+)',
                       array(
                        'methods' => 'GET',
                        'callback' => 'get_latest_posts_by_catagory'
                       )
                     );

  register_rest_route( 'mouse/v1', 
                       'players',
                       array(
                        'methods' => 'GET',
                        'callback' => 'get_players_list'
                       )
                     );
};

function get_latest_posts_by_catagory($request) {
    $args = array(
        'category' => $request['category_id']
    );

    $posts = get_posts($args);

    if (empty($posts)) {
        return new WP_Error( 'empty_category', 
                             'There are no posts to display',
                             array('status' => 404) );
    }

    $response = new WP_REST_Response($posts);
    $response->set_status(200);
    return $response;
}

// Week 13:  Add custom post types
add_action('init', 'add_custom_post_types');
function add_custom_post_types () {
    register_post_type( 
        'player',
        array(
            'labels' => array(
                'name' => __('Players', 'textdomain'),
                'singular_name' => __('Player', 'textdomain')
            ),
            'public' => true,
            'has_archive' => true
        )
    );

    register_post_type( 
        'game_level',
        array(
            'labels' => array(
                'name' => __('Levels', 'textdomain'),
                'singular_name' => __('Level', 'textdomain')
            ),
            'public' => true,
            'has_archive' => true
        )
    );

    register_post_type( 
        'game_score',
        array(
            'labels' => array(
                'name' => __('Scores', 'textdomain'),
                'singular_name' => __('Score', 'textdomain')
            ),
            'public' => true,
            'has_archive' => true
        )
    );

}

function get_players_list () {
    global $wpdb;
    $query = 'SELECT id, post_type, post_title, post_status, '
           . '       GROUP_CONCAT(wp_postmeta.meta_key, ":", REPLACE(wp_postmeta.meta_value, ":", "")) AS acf_fields '
           . '       FROM wp_posts '
           . 'INNER JOIN wp_postmeta '
           . '        ON id=wp_postmeta.post_id '
           . ' WHERE post_status="publish" '
           . '   AND post_type="player" '
           . '   AND wp_postmeta.meta_key NOT LIKE "\_%" '
           . 'GROUP BY wp_posts.id '
           ;

    $results = $wpdb->get_results($query);
    return $results;
}

